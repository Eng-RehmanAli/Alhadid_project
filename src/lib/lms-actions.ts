"use server";

import { revalidatePath } from "next/cache";
import { connectMongo } from "@/lib/db";
import { requireAdmin, requireUser, type AuthState } from "@/lib/auth-actions";
import { isAdmin, userHasCourseAccess } from "@/lib/lms";
import {
  isValidEmail,
  normalizeEmail,
} from "@/lib/auth-validation";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { Lesson } from "@/models/Lesson";
import { LessonProgress } from "@/models/LessonProgress";
import { User, USER_ROLES, type UserRole } from "@/models/User";

export type LmsActionState = AuthState;

export async function enrollStudentAction(
  _prev: LmsActionState,
  formData: FormData,
): Promise<LmsActionState> {
  const staff = await requireAdmin();

  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const courseSlug = String(formData.get("courseSlug") ?? "")
    .trim()
    .toLowerCase();

  if (!isValidEmail(email)) {
    return { error: "Enter a valid student email." };
  }
  if (!courseSlug) {
    return { error: "Select a course." };
  }

  await connectMongo();

  const course = await Course.findOne({ slug: courseSlug }).lean();
  if (!course) {
    return { error: "Course not found." };
  }

  const student = await User.findOne({ email }).lean();
  if (!student) {
    return {
      error: "No account with that email. Ask them to sign up first.",
    };
  }

  const studentId = String(student._id);
  const staffId = staff.id;

  const existing = await Enrollment.findOne({
    userId: studentId,
    courseSlug,
  } as never).lean();

  if (existing) {
    if (existing.status === "revoked") {
      await Enrollment.updateOne(
        { _id: existing._id },
        {
          $set: {
            status: "active",
            enrolledAt: new Date(),
            enrolledBy: staffId,
          },
        } as never,
      );
      revalidatePath("/dashboard");
      revalidatePath("/admin");
      revalidatePath(`/learn/${courseSlug}`);
      return {
        success: `Re-activated enrollment for ${student.name} in ${course.title}.`,
      };
    }
    return {
      error: `${student.name} is already enrolled in this course.`,
    };
  }

  await Enrollment.create({
    userId: studentId,
    courseSlug,
    status: "active",
    enrolledAt: new Date(),
    enrolledBy: staffId,
  } as never);

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath(`/learn/${courseSlug}`);

  return {
    success: `Enrolled ${student.name} in ${course.title}.`,
  };
}

export async function setUserRoleAction(
  _prev: LmsActionState,
  formData: FormData,
): Promise<LmsActionState> {
  const admin = await requireUser();
  if (admin.role !== "admin") {
    return { error: "Only admins can change roles." };
  }

  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const roleRaw = String(formData.get("role") ?? "").trim();
  const role = USER_ROLES.includes(roleRaw as UserRole)
    ? (roleRaw as UserRole)
    : null;

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email." };
  }
  if (!role) {
    return { error: "Choose a valid role." };
  }

  await connectMongo();

  const target = await User.findOne({ email });
  if (!target) {
    return { error: "No account with that email." };
  }

  if (String(target._id) === admin.id && role !== "admin") {
    return { error: "You cannot remove your own admin role." };
  }

  target.role = role;
  await target.save();

  revalidatePath("/dashboard");
  revalidatePath("/admin");

  return {
    success: `Updated ${target.name} to ${role}.`,
  };
}

export async function completeLessonAction(
  _prev: LmsActionState,
  formData: FormData,
): Promise<LmsActionState> {
  const user = await requireUser();
  const courseSlug = String(formData.get("courseSlug") ?? "").trim();
  const lessonSlug = String(formData.get("lessonSlug") ?? "").trim();

  if (!courseSlug || !lessonSlug) {
    return { error: "Missing lesson details." };
  }

  await connectMongo();

  const allowed = await userHasCourseAccess(user.id, courseSlug, user.role);
  if (!allowed) {
    return { error: "You are not enrolled in this course." };
  }

  const lesson = await Lesson.findOne({ courseSlug, slug: lessonSlug }).lean();
  if (!lesson) {
    return { error: "Lesson not found." };
  }

  const userId = user.id;

  await LessonProgress.findOneAndUpdate(
    { userId, lessonId: lesson._id },
    {
      $set: {
        userId,
        lessonId: lesson._id,
        courseSlug,
        completedAt: new Date(),
      },
    },
    { upsert: true },
  );

  const total = await Lesson.countDocuments({ courseSlug });
  const done = await LessonProgress.countDocuments({
    userId,
    courseSlug,
  } as never);

  if (total > 0 && done >= total && !isAdmin(user.role)) {
    await Enrollment.findOneAndUpdate(
      { userId, courseSlug, status: "active" } as never,
      { $set: { status: "completed" } },
    );
  }

  revalidatePath(`/learn/${courseSlug}`);
  revalidatePath(`/learn/${courseSlug}/${lessonSlug}`);
  revalidatePath("/dashboard");

  return { success: "Lesson marked complete." };
}
