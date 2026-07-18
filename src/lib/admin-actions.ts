"use server";

import { revalidatePath } from "next/cache";
import { connectMongo } from "@/lib/db";
import { requireAdmin, type AuthState } from "@/lib/auth-actions";
import {
  createLessonVideoUploadSignature,
  deleteLessonVideo,
} from "@/lib/cloudinary";
import {
  isValidEmail,
  normalizeEmail,
} from "@/lib/auth-validation";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { Lesson, LESSON_TYPES, type LessonType } from "@/models/Lesson";
import { LessonProgress } from "@/models/LessonProgress";
import { RefreshToken } from "@/models/RefreshToken";
import { User } from "@/models/User";

export type AdminActionState = AuthState;

export type VideoUploadSignatureResult =
  | {
      error: string;
      upload?: never;
    }
  | {
      error?: never;
      upload: {
        apiKey: string;
        cloudName: string;
        folder: string;
        timestamp: number;
        signature: string;
      };
    };

export async function getVideoUploadSignatureAction(): Promise<VideoUploadSignatureResult> {
  await requireAdmin();

  try {
    return { upload: createLessonVideoUploadSignature() };
  } catch (error) {
    console.error("Could not create Cloudinary upload signature:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Cloudinary upload is unavailable.",
    };
  }
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/courses");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function setEnrollmentStatusAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const enrollmentId = String(formData.get("enrollmentId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!enrollmentId) return { error: "Missing enrollment." };
  if (!["active", "revoked", "completed"].includes(status)) {
    return { error: "Invalid status." };
  }

  await connectMongo();
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) return { error: "Enrollment not found." };

  enrollment.status = status as "active" | "revoked" | "completed";
  if (status === "active") {
    enrollment.enrolledAt = new Date();
  }
  await enrollment.save();

  revalidateAdmin();
  revalidatePath(`/learn/${enrollment.courseSlug}`);
  revalidatePath(`/admin/students/${String(enrollment.userId)}`);

  return {
    success:
      status === "revoked"
        ? "Enrollment revoked."
        : status === "active"
          ? "Enrollment re-activated."
          : "Enrollment marked completed.",
  };
}

export async function bulkEnrollAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const staff = await requireAdmin();

  const courseSlug = String(formData.get("courseSlug") ?? "")
    .trim()
    .toLowerCase();
  const emailsRaw = String(formData.get("emails") ?? "");

  if (!courseSlug) return { error: "Select a course." };

  const emails = [
    ...new Set(
      emailsRaw
        .split(/[\n,;]+/)
        .map((e) => normalizeEmail(e))
        .filter(Boolean),
    ),
  ];

  if (emails.length === 0) {
    return { error: "Enter at least one student email." };
  }

  await connectMongo();
  const course = await Course.findOne({ slug: courseSlug }).lean();
  if (!course) return { error: "Course not found." };

  let enrolled = 0;
  let reactivated = 0;
  let skipped = 0;
  const missing: string[] = [];

  for (const email of emails) {
    if (!isValidEmail(email)) {
      skipped += 1;
      continue;
    }
    const student = await User.findOne({ email }).lean();
    if (!student) {
      missing.push(email);
      continue;
    }

    const studentId = String(student._id);
    const existing = await Enrollment.findOne({
      userId: studentId,
      courseSlug,
    } as never);

    if (existing) {
      if (existing.status === "revoked") {
        existing.status = "active";
        existing.enrolledAt = new Date();
        existing.enrolledBy = staff.id as never;
        await existing.save();
        reactivated += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    await Enrollment.create({
      userId: studentId,
      courseSlug,
      status: "active",
      enrolledAt: new Date(),
      enrolledBy: staff.id,
    } as never);
    enrolled += 1;
  }

  revalidateAdmin();
  revalidatePath(`/learn/${courseSlug}`);

  const parts = [
    enrolled ? `${enrolled} enrolled` : null,
    reactivated ? `${reactivated} re-activated` : null,
    skipped ? `${skipped} skipped` : null,
    missing.length ? `${missing.length} not found` : null,
  ].filter(Boolean);

  return {
    success: `Bulk enroll for ${course.title}: ${parts.join(", ")}.`,
    error: missing.length
      ? `Missing accounts: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "…" : ""}`
      : undefined,
  };
}

export async function forceLogoutAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim();
  if (!userId) return { error: "Missing user." };
  if (userId === admin.id) {
    return { error: "Use Log out for your own session." };
  }

  await connectMongo();
  const result = await RefreshToken.deleteMany({ userId } as never);
  revalidateAdmin();
  return {
    success: `Forced logout (${result.deletedCount} session(s) revoked).`,
  };
}

export async function setStudentDisabledAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim();
  const disabled = String(formData.get("disabled") ?? "") === "true";

  if (!userId) return { error: "Missing user." };
  if (userId === admin.id) {
    return { error: "You cannot disable your own account." };
  }

  await connectMongo();
  const user = await User.findById(userId);
  if (!user) return { error: "User not found." };
  if (user.role === "admin") {
    return { error: "Disable student accounts only." };
  }

  user.disabled = disabled;
  await user.save();
  if (disabled) {
    await RefreshToken.deleteMany({ userId } as never);
  }

  revalidateAdmin();
  revalidatePath(`/admin/students/${userId}`);
  return {
    success: disabled
      ? `${user.name} disabled and logged out.`
      : `${user.name} re-enabled.`,
  };
}

export async function deleteStudentAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim();
  if (!userId) return { error: "Missing user." };
  if (userId === admin.id) {
    return { error: "You cannot delete your own account." };
  }

  await connectMongo();
  const user = await User.findById(userId);
  if (!user) return { error: "User not found." };
  if (user.role === "admin") {
    return { error: "Cannot delete admin accounts here." };
  }

  await Promise.all([
    Enrollment.deleteMany({ userId } as never),
    LessonProgress.deleteMany({ userId } as never),
    RefreshToken.deleteMany({ userId } as never),
    User.deleteOne({ _id: userId } as never),
  ]);

  revalidateAdmin();
  return { success: `Deleted ${user.name} and related LMS data.` };
}

export async function upsertCourseAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || "Contact";
  const facultySlug = String(formData.get("facultySlug") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const featured = String(formData.get("featured") ?? "") === "on";
  const duration = String(formData.get("duration") ?? "").trim() || undefined;
  const level = String(formData.get("level") ?? "").trim() || undefined;
  const existingSlug = String(formData.get("existingSlug") ?? "").trim();

  if (!title || title.length < 3) {
    return { error: "Enter a course title (min 3 characters)." };
  }
  if (!summary || summary.length < 10) {
    return { error: "Enter a short course summary." };
  }
  if (!facultySlug) return { error: "Select a faculty." };

  if (!slug) slug = slugify(title);
  if (!slug) return { error: "Could not build a course slug." };

  await connectMongo();

  if (existingSlug) {
    const course = await Course.findOne({ slug: existingSlug });
    if (!course) return { error: "Course not found." };
    course.title = title;
    course.summary = summary;
    course.price = price;
    course.facultySlug = facultySlug;
    course.featured = featured;
    course.duration = duration;
    course.level = level;
    await course.save();
    revalidateAdmin();
    revalidatePath(`/courses/${existingSlug}`);
    return { success: `Updated course “${title}”.` };
  }

  const clash = await Course.findOne({ slug }).lean();
  if (clash) {
    return { error: `Slug “${slug}” already exists. Choose another.` };
  }

  await Course.create({
    slug,
    title,
    summary,
    price,
    facultySlug,
    featured,
    duration,
    level,
    modules: [],
    outcomes: [],
  });

  revalidateAdmin();
  return { success: `Created course “${title}”.` };
}

export async function upsertLessonAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const courseSlug = String(formData.get("courseSlug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const moduleTitle =
    String(formData.get("moduleTitle") ?? "").trim() || "Module 1";
  const moduleIndex = Number(formData.get("moduleIndex") ?? 0);
  const orderRaw = String(formData.get("order") ?? "").trim();
  let order = orderRaw ? Number(orderRaw) : undefined;
  const typeRaw = String(formData.get("type") ?? "text").trim();
  const content = String(formData.get("content") ?? "").trim();
  const cloudinaryPublicId = String(
    formData.get("cloudinaryPublicId") ?? "",
  ).trim();
  let slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const existingId = String(formData.get("lessonId") ?? "").trim();
  const durationMinutesRaw = String(formData.get("durationMinutes") ?? "").trim();

  const type = LESSON_TYPES.includes(typeRaw as LessonType)
    ? (typeRaw as LessonType)
    : null;

  if (!courseSlug) return { error: "Select a course." };
  if (!title) return { error: "Enter a lesson title." };
  if (!type) return { error: "Choose a valid lesson type." };
  if (!content) return { error: "Enter lesson content (URL or text)." };
  if (
    cloudinaryPublicId &&
    (!content.startsWith("https://res.cloudinary.com/") ||
      !cloudinaryPublicId.startsWith("alhadid/lessons/"))
  ) {
    return { error: "Invalid Cloudinary video details." };
  }
  if (!Number.isFinite(moduleIndex) || moduleIndex < 0) {
    return { error: "Module index must be 0 or higher." };
  }
  if (order !== undefined && (!Number.isFinite(order) || order < 0)) {
    return { error: "Order must be 0 or higher." };
  }

  if (!slug) slug = slugify(title);
  if (!slug) return { error: "Could not build a lesson slug." };

  const durationMinutes = durationMinutesRaw
    ? Number(durationMinutesRaw)
    : undefined;
  if (
    durationMinutesRaw &&
    (!Number.isFinite(durationMinutes) || (durationMinutes as number) < 0)
  ) {
    return { error: "Duration must be a positive number." };
  }

  await connectMongo();
  const course = await Course.findOne({ slug: courseSlug }).lean();
  if (!course) return { error: "Course not found." };

  if (existingId) {
    const lesson = await Lesson.findById(existingId);
    if (!lesson) return { error: "Lesson not found." };
    lesson.title = title;
    lesson.moduleTitle = moduleTitle;
    lesson.moduleIndex = moduleIndex;
    if (order !== undefined) lesson.order = order;
    lesson.type = type;
    lesson.content = content;
    lesson.cloudinaryPublicId = cloudinaryPublicId || undefined;
    lesson.durationMinutes = durationMinutes;
    await lesson.save();
    revalidateAdmin();
    revalidatePath(`/learn/${courseSlug}`);
    return { success: `Updated lesson “${title}”.` };
  }

  const clash = await Lesson.findOne({ courseSlug, slug }).lean();
  if (clash) {
    return { error: `Lesson slug “${slug}” already exists in this course.` };
  }

  if (order === undefined) {
    const lastLesson = await Lesson.findOne({ courseSlug })
      .sort({ order: -1 })
      .select({ order: 1 })
      .lean();
    order = (lastLesson?.order ?? -1) + 1;
  }

  await Lesson.create({
    courseSlug,
    slug,
    title,
    moduleTitle,
    moduleIndex,
    order,
    type,
    content,
    cloudinaryPublicId: cloudinaryPublicId || undefined,
    durationMinutes,
  });

  revalidateAdmin();
  revalidatePath(`/learn/${courseSlug}`);
  return { success: `Created lesson “${title}”.` };
}

export async function deleteLessonAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const lessonId = String(formData.get("lessonId") ?? "").trim();
  if (!lessonId) return { error: "Missing lesson." };

  await connectMongo();
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return { error: "Lesson not found." };

  const courseSlug = lesson.courseSlug;
  const cloudinaryPublicId = lesson.cloudinaryPublicId;
  await LessonProgress.deleteMany({ lessonId } as never);
  await lesson.deleteOne();

  if (cloudinaryPublicId) {
    try {
      await deleteLessonVideo(cloudinaryPublicId);
    } catch (error) {
      console.error("Could not delete Cloudinary lesson video:", error);
    }
  }

  revalidateAdmin();
  revalidatePath(`/learn/${courseSlug}`);
  return { success: `Deleted lesson “${lesson.title}”.` };
}

export async function deleteContactMessageAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("messageId") ?? "").trim();
  if (!id) return { error: "Missing message." };

  await connectMongo();
  const { ContactMessage } = await import("@/models/ContactMessage");
  await ContactMessage.deleteOne({ _id: id } as never);
  revalidateAdmin();
  return { success: "Contact message deleted." };
}

export async function deleteWaitlistEntryAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("entryId") ?? "").trim();
  if (!id) return { error: "Missing waitlist entry." };

  await connectMongo();
  const { WaitlistEntry } = await import("@/models/WaitlistEntry");
  await WaitlistEntry.deleteOne({ _id: id } as never);
  revalidateAdmin();
  return { success: "Waitlist entry deleted." };
}
