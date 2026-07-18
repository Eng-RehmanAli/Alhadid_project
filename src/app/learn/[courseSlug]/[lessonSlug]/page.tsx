import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CompleteLessonButton } from "@/components/CompleteLessonButton";
import { requireUser } from "@/lib/auth-actions";
import {
  getCompletedLessonIds,
  getCourseLessons,
  userHasCourseAccess,
  youtubeEmbedSrc,
} from "@/lib/lms";
import { connectMongo } from "@/lib/db";
import { Course } from "@/models/Course";
import { Lesson } from "@/models/Lesson";

type PageProps = {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  await connectMongo();
  const lesson = await Lesson.findOne({ courseSlug, slug: lessonSlug }).lean();
  return {
    title: lesson ? lesson.title : "Lesson",
  };
}

export default async function LearnLessonPage({ params }: PageProps) {
  const user = await requireUser();
  const { courseSlug, lessonSlug } = await params;

  await connectMongo();
  const course = await Course.findOne({ slug: courseSlug }).lean();
  if (!course) notFound();

  const allowed = await userHasCourseAccess(user.id, courseSlug, user.role);
  if (!allowed) {
    redirect(`/courses/${courseSlug}`);
  }

  const lesson = await Lesson.findOne({ courseSlug, slug: lessonSlug }).lean();
  if (!lesson) notFound();

  const allLessons = await getCourseLessons(courseSlug);
  const completed = await getCompletedLessonIds(user.id, courseSlug);
  const isDone = completed.has(String(lesson._id));
  const index = allLessons.findIndex((l) => String(l._id) === String(lesson._id));
  const prev = index > 0 ? allLessons[index - 1] : null;
  const next = index >= 0 && index < allLessons.length - 1 ? allLessons[index + 1] : null;

  const embed = lesson.type === "video" ? youtubeEmbedSrc(lesson.content) : null;

  return (
    <div className="bg-mist">
      <div className="border-b border-line-dark bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5 md:px-8">
          <div className="min-w-0">
            <Link
              href={`/learn/${courseSlug}`}
              className="text-sm font-medium text-muted hover:text-teal-deep"
            >
              ← {course.title}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-teal-deep">
              {lesson.moduleTitle} · {lesson.type}
            </p>
          </div>
          <CompleteLessonButton
            courseSlug={courseSlug}
            lessonSlug={lessonSlug}
            completed={isDone}
          />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-5 md:px-8 md:py-14">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
          {lesson.title}
        </h1>

        <div className="mt-8">
          {lesson.type === "video" ? (
            embed ? (
              <div className="aspect-video overflow-hidden bg-ink">
                <iframe
                  src={embed}
                  title={lesson.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                controls
                className="aspect-video w-full bg-ink"
                src={lesson.content}
              >
                Your browser does not support embedded video.
              </video>
            )
          ) : null}

          {lesson.type === "pdf" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Open the PDF resource in a new tab, then mark this lesson
                complete when finished.
              </p>
              <a
                href={lesson.content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-teal-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-deep"
              >
                Open PDF
              </a>
            </div>
          ) : null}

          {lesson.type === "text" ? (
            <div className="prose-lesson whitespace-pre-wrap text-[1.05rem] leading-relaxed text-ink">
              {lesson.content}
            </div>
          ) : null}

          {lesson.type === "video" ? (
            <p className="mt-6 text-sm text-muted">
              Watch the full video, then mark the lesson complete to update your
              progress.
            </p>
          ) : null}

          {lesson.type === "video" && lesson.summary ? (
            <section className="mt-8 rounded-2xl border border-line-dark bg-white p-5 sm:p-6">
              <h2 className="font-display text-lg font-semibold text-heading">
                Lesson summary
              </h2>
              <div className="prose-lesson mt-3 whitespace-pre-wrap text-[1.02rem] leading-relaxed text-ink">
                {lesson.summary}
              </div>
            </section>
          ) : null}
        </div>

        <nav className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line-dark pt-8">
          {prev ? (
            <Link
              href={`/learn/${courseSlug}/${prev.slug}`}
              className="text-sm font-semibold text-teal-deep hover:underline"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/learn/${courseSlug}/${next.slug}`}
              className="text-sm font-semibold text-teal-deep hover:underline"
            >
              {next.title} →
            </Link>
          ) : (
            <Link
              href={`/learn/${courseSlug}`}
              className="text-sm font-semibold text-teal-deep hover:underline"
            >
              Back to outline →
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
