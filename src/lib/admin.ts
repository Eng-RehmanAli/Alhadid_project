import { connectMongo } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { Faculty } from "@/models/Faculty";
import { Lesson } from "@/models/Lesson";
import { LessonProgress } from "@/models/LessonProgress";
import { User, normalizeRole, type UserRole } from "@/models/User";
import { WaitlistEntry } from "@/models/WaitlistEntry";

export type AdminStats = {
  students: number;
  admins: number;
  courses: number;
  lessons: number;
  activeEnrollments: number;
  waitlist: number;
  contactMessages: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  await connectMongo();

  const [
    students,
    admins,
    courses,
    lessons,
    activeEnrollments,
    waitlist,
    contactMessages,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "admin" }),
    Course.countDocuments({}),
    Lesson.countDocuments({}),
    Enrollment.countDocuments({ status: "active" } as never),
    WaitlistEntry.countDocuments({}),
    ContactMessage.countDocuments({}),
  ]);

  return {
    students,
    admins,
    courses,
    lessons,
    activeEnrollments,
    waitlist,
    contactMessages,
  };
}

export type AdminEnrollmentRow = {
  enrollmentId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  courseSlug: string;
  courseTitle: string;
  status: string;
  enrolledAt: Date;
};

async function mapEnrollments(
  enrollments: Array<{
    _id: { toString(): string };
    userId: { toString(): string };
    courseSlug: string;
    status: string;
    enrolledAt: Date;
  }>,
): Promise<AdminEnrollmentRow[]> {
  if (enrollments.length === 0) return [];

  const userIds = [...new Set(enrollments.map((e) => String(e.userId)))];
  const slugs = [...new Set(enrollments.map((e) => e.courseSlug))];

  const [users, courses] = await Promise.all([
    User.find({ _id: { $in: userIds } } as never)
      .select("name email")
      .lean(),
    Course.find({ slug: { $in: slugs } })
      .select("slug title")
      .lean(),
  ]);

  const userById = new Map(users.map((u) => [String(u._id), u]));
  const courseBySlug = new Map(courses.map((c) => [c.slug, c]));

  return enrollments.map((enrollment) => {
    const student = userById.get(String(enrollment.userId));
    const course = courseBySlug.get(enrollment.courseSlug);
    return {
      enrollmentId: String(enrollment._id),
      userId: String(enrollment.userId),
      studentName: student?.name ?? "Unknown user",
      studentEmail: student?.email ?? "—",
      courseSlug: enrollment.courseSlug,
      courseTitle: course?.title ?? enrollment.courseSlug,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
    };
  });
}

export async function getRecentEnrollments(
  limit = 40,
): Promise<AdminEnrollmentRow[]> {
  await connectMongo();
  const enrollments = await Enrollment.find({})
    .sort({ enrolledAt: -1 })
    .limit(limit)
    .lean();
  return mapEnrollments(enrollments);
}

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  disabled: boolean;
  createdAt: Date | null;
};

export async function getRecentUsers(limit = 12): Promise<AdminUserRow[]> {
  await connectMongo();

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("name email role disabled createdAt")
    .lean();

  return users.map((user) => ({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    disabled: Boolean(user.disabled),
    createdAt: user.createdAt ?? null,
  }));
}

/** Every student account from signup (role = student). */
export async function getAllStudents(): Promise<AdminUserRow[]> {
  await connectMongo();

  const users = await User.find({ role: "student" })
    .sort({ createdAt: -1 })
    .select("name email role disabled createdAt")
    .lean();

  return users.map((user) => ({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: "student",
    disabled: Boolean(user.disabled),
    createdAt: user.createdAt ?? null,
  }));
}

export type CourseEnrollmentCount = {
  courseSlug: string;
  title: string;
  active: number;
  completed: number;
  revoked: number;
  total: number;
};

export async function getCourseEnrollmentCounts(): Promise<
  CourseEnrollmentCount[]
> {
  await connectMongo();

  const [courses, enrollments] = await Promise.all([
    Course.find({}).select("slug title").sort({ title: 1 }).lean(),
    Enrollment.find({}).select("courseSlug status").lean(),
  ]);

  const counts = new Map<
    string,
    { active: number; completed: number; revoked: number }
  >();

  for (const row of enrollments) {
    const current = counts.get(row.courseSlug) ?? {
      active: 0,
      completed: 0,
      revoked: 0,
    };
    if (row.status === "active") current.active += 1;
    else if (row.status === "completed") current.completed += 1;
    else if (row.status === "revoked") current.revoked += 1;
    counts.set(row.courseSlug, current);
  }

  return courses.map((course) => {
    const c = counts.get(course.slug) ?? {
      active: 0,
      completed: 0,
      revoked: 0,
    };
    return {
      courseSlug: course.slug,
      title: course.title,
      active: c.active,
      completed: c.completed,
      revoked: c.revoked,
      total: c.active + c.completed + c.revoked,
    };
  });
}

export type StudentProgressCourse = {
  courseSlug: string;
  title: string;
  status: string;
  enrolledAt: Date;
  done: number;
  total: number;
  percent: number;
};

export async function getStudentProgress(
  userId: string,
): Promise<StudentProgressCourse[]> {
  await connectMongo();

  const enrollments = await Enrollment.find({ userId } as never)
    .sort({ enrolledAt: -1 })
    .lean();

  if (enrollments.length === 0) return [];

  const slugs = enrollments.map((e) => e.courseSlug);
  const [courses, lessons, progress] = await Promise.all([
    Course.find({ slug: { $in: slugs } }).select("slug title").lean(),
    Lesson.find({ courseSlug: { $in: slugs } }).select("courseSlug").lean(),
    LessonProgress.find({ userId, courseSlug: { $in: slugs } } as never)
      .select("courseSlug")
      .lean(),
  ]);

  const courseBySlug = new Map(courses.map((c) => [c.slug, c]));
  const totalBySlug = new Map<string, number>();
  for (const lesson of lessons) {
    totalBySlug.set(
      lesson.courseSlug,
      (totalBySlug.get(lesson.courseSlug) ?? 0) + 1,
    );
  }
  const doneBySlug = new Map<string, number>();
  for (const row of progress) {
    doneBySlug.set(row.courseSlug, (doneBySlug.get(row.courseSlug) ?? 0) + 1);
  }

  return enrollments.map((enrollment) => {
    const total = totalBySlug.get(enrollment.courseSlug) ?? 0;
    const done = doneBySlug.get(enrollment.courseSlug) ?? 0;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return {
      courseSlug: enrollment.courseSlug,
      title: courseBySlug.get(enrollment.courseSlug)?.title ?? enrollment.courseSlug,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      done,
      total,
      percent,
    };
  });
}

export type IncompleteStudentRow = {
  userId: string;
  name: string;
  email: string;
  courseSlug: string;
  courseTitle: string;
  percent: number;
  done: number;
  total: number;
};

export async function getIncompleteStudents(): Promise<IncompleteStudentRow[]> {
  await connectMongo();

  const enrollments = await Enrollment.find({
    status: { $in: ["active", "completed"] },
  } as never)
    .sort({ enrolledAt: -1 })
    .lean();

  if (enrollments.length === 0) return [];

  const userIds = [...new Set(enrollments.map((e) => String(e.userId)))];
  const slugs = [...new Set(enrollments.map((e) => e.courseSlug))];

  const [users, courses, lessons, progress] = await Promise.all([
    User.find({ _id: { $in: userIds } } as never)
      .select("name email")
      .lean(),
    Course.find({ slug: { $in: slugs } }).select("slug title").lean(),
    Lesson.find({ courseSlug: { $in: slugs } }).select("courseSlug").lean(),
    LessonProgress.find({
      userId: { $in: userIds },
      courseSlug: { $in: slugs },
    } as never)
      .select("userId courseSlug")
      .lean(),
  ]);

  const userById = new Map(users.map((u) => [String(u._id), u]));
  const courseBySlug = new Map(courses.map((c) => [c.slug, c]));
  const totalBySlug = new Map<string, number>();
  for (const lesson of lessons) {
    totalBySlug.set(
      lesson.courseSlug,
      (totalBySlug.get(lesson.courseSlug) ?? 0) + 1,
    );
  }

  const doneKey = (userId: string, courseSlug: string) =>
    `${userId}:${courseSlug}`;
  const doneByKey = new Map<string, number>();
  for (const row of progress) {
    const key = doneKey(String(row.userId), row.courseSlug);
    doneByKey.set(key, (doneByKey.get(key) ?? 0) + 1);
  }

  const rows: IncompleteStudentRow[] = [];
  for (const enrollment of enrollments) {
    const userId = String(enrollment.userId);
    const user = userById.get(userId);
    if (!user) continue;
    const total = totalBySlug.get(enrollment.courseSlug) ?? 0;
    const done = doneByKey.get(doneKey(userId, enrollment.courseSlug)) ?? 0;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    if (total > 0 && percent >= 100) continue;
    rows.push({
      userId,
      name: user.name,
      email: user.email,
      courseSlug: enrollment.courseSlug,
      courseTitle:
        courseBySlug.get(enrollment.courseSlug)?.title ?? enrollment.courseSlug,
      percent,
      done,
      total,
    });
  }

  return rows.sort((a, b) => a.percent - b.percent);
}

export type ActivityItem = {
  id: string;
  type: "signup" | "enrollment" | "lesson";
  label: string;
  detail: string;
  at: Date;
};

export async function getActivityFeed(limit = 20): Promise<ActivityItem[]> {
  await connectMongo();

  const [signups, enrollments, lessonRows] = await Promise.all([
    User.find({ role: "student" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("name email createdAt")
      .lean(),
    Enrollment.find({})
      .sort({ enrolledAt: -1 })
      .limit(limit)
      .lean(),
    LessonProgress.find({})
      .sort({ completedAt: -1 })
      .limit(limit)
      .lean(),
  ]);

  const enrollmentMapped = await mapEnrollments(enrollments);

  const userIds = [
    ...new Set(lessonRows.map((row) => String(row.userId))),
  ];
  const lessonIds = [
    ...new Set(lessonRows.map((row) => String(row.lessonId))),
  ];
  const [users, lessons] = await Promise.all([
    User.find({ _id: { $in: userIds } } as never)
      .select("name email")
      .lean(),
    Lesson.find({ _id: { $in: lessonIds } } as never)
      .select("title courseSlug")
      .lean(),
  ]);
  const userById = new Map(users.map((u) => [String(u._id), u]));
  const lessonById = new Map(lessons.map((l) => [String(l._id), l]));

  const items: ActivityItem[] = [];

  for (const user of signups) {
    if (!user.createdAt) continue;
    items.push({
      id: `signup-${String(user._id)}`,
      type: "signup",
      label: "New signup",
      detail: `${user.name} (${user.email})`,
      at: user.createdAt,
    });
  }

  for (const row of enrollmentMapped) {
    items.push({
      id: `enroll-${row.enrollmentId}`,
      type: "enrollment",
      label: `Enrollment ${row.status}`,
      detail: `${row.studentName} → ${row.courseTitle}`,
      at: row.enrolledAt,
    });
  }

  for (const row of lessonRows) {
    const user = userById.get(String(row.userId));
    const lesson = lessonById.get(String(row.lessonId));
    items.push({
      id: `lesson-${String(row._id)}`,
      type: "lesson",
      label: "Lesson completed",
      detail: `${user?.name ?? "Student"} finished ${lesson?.title ?? "a lesson"}`,
      at: row.completedAt,
    });
  }

  return items
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, limit);
}

export async function getContactMessages(limit = 30) {
  await connectMongo();
  return ContactMessage.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getWaitlistEntries(limit = 30) {
  await connectMongo();
  return WaitlistEntry.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getFacultyOptions() {
  await connectMongo();
  const faculties = await Faculty.find({})
    .select("slug title")
    .sort({ title: 1 })
    .lean();
  return faculties.map((f) => ({ slug: f.slug, title: f.title }));
}

export async function getAdminCourses() {
  await connectMongo();
  return Course.find({})
    .sort({ title: 1 })
    .select(
      "slug title summary price facultySlug featured duration level badge seatsLeft",
    )
    .lean();
}

export async function getAdminLessons(courseSlug?: string) {
  await connectMongo();
  const filter = courseSlug ? { courseSlug } : {};
  return Lesson.find(filter)
    .sort({ courseSlug: 1, order: 1 })
    .lean();
}

export async function getStudentById(id: string) {
  await connectMongo();
  const user = await User.findById(id)
    .select("name email role disabled createdAt")
    .lean();
  if (!user || normalizeRole(user.role) !== "student") return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: "student" as const,
    disabled: Boolean(user.disabled),
    createdAt: user.createdAt ?? null,
  };
}
