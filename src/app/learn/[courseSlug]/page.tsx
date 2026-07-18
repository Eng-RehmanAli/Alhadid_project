import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-actions";
import {
  getCompletedLessonIds,
  getCourseLessons,
  groupLessonsByModule,
  userHasCourseAccess,
} from "@/lib/lms";
import { connectMongo } from "@/lib/db";
import { Course } from "@/models/Course";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  await connectMongo();
  const course = await Course.findOne({ slug: courseSlug }).lean();
  return {
    title: course ? `Learn · ${course.title}` : "Learn",
  };
}

export default async function LearnCoursePage({ params }: PageProps) {
  const user = await requireUser();
  const { courseSlug } = await params;

  await connectMongo();
  const course = await Course.findOne({ slug: courseSlug }).lean();
  if (!course) notFound();

  const allowed = await userHasCourseAccess(user.id, courseSlug, user.role);
  if (!allowed) {
    redirect(`/courses/${courseSlug}`);
  }

  const lessons = await getCourseLessons(courseSlug);
  const completed = await getCompletedLessonIds(user.id, courseSlug);
  const modules = groupLessonsByModule(lessons);
  const total = lessons.length;
  const done = lessons.filter((l) => completed.has(String(l._id))).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const firstIncomplete = lessons.find((l) => !completed.has(String(l._id)));
  const continueHref = firstIncomplete
    ? `/learn/${courseSlug}/${firstIncomplete.slug}`
    : lessons[0]
      ? `/learn/${courseSlug}/${lessons[0].slug}`
      : null;

  return (
    <div className="bg-mist">
      <section className="bg-teal text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 md:px-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-white/70 hover:text-white"
          >
            ← Dashboard
          </Link>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">{course.summary}</p>
          <p className="mt-6 text-sm font-semibold text-lime">
            {percent}% complete · {done}/{total} lessons
          </p>
          <div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-lime"
              style={{ width: `${percent}%` }}
            />
          </div>
          {continueHref ? (
            <Link
              href={continueHref}
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-soft"
            >
              {done > 0 && done < total ? "Continue learning" : "Start course"}
            </Link>
          ) : (
            <p className="mt-8 text-sm text-white/65">
              Curriculum coming soon for this course.
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 md:px-8">
        {modules.length === 0 ? (
          <p className="text-muted">No lessons published yet.</p>
        ) : (
          <ol className="space-y-10">
            {modules.map((mod) => (
              <li key={mod.moduleIndex}>
                <h2 className="font-display text-xl font-semibold text-heading">
                  Module {mod.moduleIndex + 1}: {mod.moduleTitle}
                </h2>
                <ul className="mt-4 divide-y divide-line-dark border-t border-line-dark">
                  {mod.lessons.map((lesson) => {
                    const isDone = completed.has(String(lesson._id));
                    return (
                      <li key={String(lesson._id)}>
                        <Link
                          href={`/learn/${courseSlug}/${lesson.slug}`}
                          className="flex items-center justify-between gap-4 py-4 text-ink hover:text-teal-deep"
                        >
                          <span className="min-w-0">
                            <span className="block font-semibold">
                              {lesson.title}
                            </span>
                            <span className="mt-0.5 block text-xs uppercase tracking-[0.14em] text-muted">
                              {lesson.type}
                              {lesson.durationMinutes
                                ? ` · ${lesson.durationMinutes} min`
                                : ""}
                            </span>
                          </span>
                          <span
                            className={`shrink-0 text-sm font-semibold ${
                              isDone ? "text-teal-deep" : "text-muted"
                            }`}
                          >
                            {isDone ? "Done" : "Open"}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
