"use server";

import { requireAdmin } from "@/lib/auth-actions";
import { connectMongo } from "@/lib/db";
import { Lesson, type SummaryStatus } from "@/models/Lesson";

export type LessonSummaryStatus = {
  status: SummaryStatus;
  summary?: string;
  error?: string;
  generatedAt?: string;
};

export async function getLessonSummaryStatusAction(
  lessonId: string,
): Promise<LessonSummaryStatus> {
  await requireAdmin();
  await connectMongo();

  const lesson = await Lesson.findById(lessonId)
    .select("summary summaryStatus summaryError summaryGeneratedAt")
    .lean();

  if (!lesson) {
    return { status: "failed", error: "Lesson not found." };
  }

  return {
    status: lesson.summaryStatus ?? "idle",
    summary: lesson.summary ?? undefined,
    error: lesson.summaryError ?? undefined,
    generatedAt: lesson.summaryGeneratedAt
      ? new Date(lesson.summaryGeneratedAt).toISOString()
      : undefined,
  };
}
