import { connectMongo } from "@/lib/db";
import { Enrollment } from "@/models/Enrollment";
import { Lesson } from "@/models/Lesson";
import { LessonProgress } from "@/models/LessonProgress";
import type { UserRole } from "@/models/User";
import { Course } from "@/models/Course";

export function isAdmin(role: UserRole) {
  return role === "admin";
}

export async function userHasCourseAccess(
  userId: string,
  courseSlug: string,
  role: UserRole,
) {
  if (isAdmin(role)) return true;

  await connectMongo();
  const enrollment = await Enrollment.findOne({
    userId,
    courseSlug,
    status: { $in: ["active", "completed"] },
  } as never)
    .select("_id")
    .lean();

  return Boolean(enrollment);
}

export async function getEnrolledCoursesForUser(userId: string) {
  await connectMongo();

  const enrollments = await Enrollment.find({
    userId,
    status: { $in: ["active", "completed"] },
  } as never)
    .sort({ enrolledAt: -1 })
    .lean();

  if (enrollments.length === 0) return [];

  const slugs = enrollments.map((e) => e.courseSlug);
  const courses = await Course.find({ slug: { $in: slugs } }).lean();
  const courseBySlug = new Map(courses.map((c) => [c.slug, c]));

  const lessons = await Lesson.find({ courseSlug: { $in: slugs } })
    .select("courseSlug")
    .lean();
  const totalBySlug = new Map<string, number>();
  for (const lesson of lessons) {
    totalBySlug.set(
      lesson.courseSlug,
      (totalBySlug.get(lesson.courseSlug) ?? 0) + 1,
    );
  }

  const progressRows = await LessonProgress.find({
    userId,
    courseSlug: { $in: slugs },
  } as never)
    .select("courseSlug")
    .lean();
  const doneBySlug = new Map<string, number>();
  for (const row of progressRows) {
    doneBySlug.set(row.courseSlug, (doneBySlug.get(row.courseSlug) ?? 0) + 1);
  }

  return enrollments
    .map((enrollment) => {
      const course = courseBySlug.get(enrollment.courseSlug);
      if (!course) return null;
      const total = totalBySlug.get(enrollment.courseSlug) ?? 0;
      const done = doneBySlug.get(enrollment.courseSlug) ?? 0;
      const percent = total === 0 ? 0 : Math.round((done / total) * 100);
      return {
        enrollmentId: String(enrollment._id),
        courseSlug: enrollment.courseSlug,
        title: course.title,
        summary: course.summary,
        image: course.image,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        progress: { done, total, percent },
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
}

export async function getCourseLessons(courseSlug: string) {
  await connectMongo();
  return Lesson.find({ courseSlug }).sort({ order: 1 }).lean();
}

export async function getCompletedLessonIds(
  userId: string,
  courseSlug: string,
) {
  await connectMongo();
  const rows = await LessonProgress.find({
    userId,
    courseSlug,
  } as never)
    .select("lessonId")
    .lean();
  return new Set(rows.map((row) => String(row.lessonId)));
}

export function groupLessonsByModule<
  T extends { moduleIndex: number; moduleTitle: string; order: number },
>(lessons: T[]) {
  const modules = new Map<
    number,
    { moduleIndex: number; moduleTitle: string; lessons: T[] }
  >();

  for (const lesson of lessons) {
    const existing = modules.get(lesson.moduleIndex);
    if (existing) {
      existing.lessons.push(lesson);
    } else {
      modules.set(lesson.moduleIndex, {
        moduleIndex: lesson.moduleIndex,
        moduleTitle: lesson.moduleTitle,
        lessons: [lesson],
      });
    }
  }

  return [...modules.values()].sort((a, b) => a.moduleIndex - b.moduleIndex);
}

export function youtubeEmbedSrc(content: string) {
  if (content.includes("youtube.com/embed/") || content.includes("youtube-nocookie.com/embed/")) {
    return content;
  }
  try {
    const url = new URL(content);
    if (
      url.hostname.includes("youtube.com") &&
      url.searchParams.get("v")
    ) {
      return `https://www.youtube-nocookie.com/embed/${url.searchParams.get("v")}?rel=0`;
    }
    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }
  } catch {
    return null;
  }
  return null;
}
