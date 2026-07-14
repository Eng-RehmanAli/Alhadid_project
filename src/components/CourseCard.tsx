"use client";

import Link from "next/link";
import { trackEnrollClick } from "@/lib/analytics";
import { whatsappEnrollUrl } from "@/lib/whatsapp";

export type CourseCardData = {
  slug: string;
  title: string;
  summary: string;
  price: string;
  facultyTitle: string;
  facultySlug: string;
  badge?: string;
};

type CourseCardProps = {
  course: CourseCardData;
  onLight?: boolean;
};

export function CourseCard({ course, onLight = false }: CourseCardProps) {
  const enrollHref = whatsappEnrollUrl(course.title);

  return (
    <article
      className={`group hover-lift flex h-full flex-col rounded-3xl border p-6 ${
        onLight
          ? "border-line-dark bg-white shadow-[0_10px_30px_rgba(14,106,111,0.08)] hover:border-teal/30"
          : "border-white/25 bg-white/12 shadow-[0_18px_40px_-12px_rgba(0,30,35,0.45)] backdrop-blur-md hover:border-lime/45 hover:shadow-[0_24px_48px_-10px_rgba(0,30,35,0.5)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-xs font-semibold uppercase tracking-[0.16em] ${
            onLight ? "text-teal-deep" : "text-lime"
          }`}
        >
          {course.facultyTitle}
        </p>
        {course.badge ? (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${
              onLight ? "bg-lime text-ink" : "bg-lime/20 text-lime"
            }`}
          >
            {course.badge}
          </span>
        ) : null}
      </div>

      <h3
        className={`mt-4 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight ${
          onLight ? "text-heading" : "text-white"
        }`}
      >
        <Link
          href={`/courses/${course.slug}`}
          className="transition-opacity hover:opacity-80"
        >
          {course.title}
        </Link>
      </h3>

      <p
        className={`mt-3 flex-1 text-sm leading-relaxed ${
          onLight ? "text-muted" : "text-white/70"
        }`}
      >
        {course.summary}
      </p>

      <div
        className={`mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5 ${
          onLight ? "border-line-dark" : "border-white/15"
        }`}
      >
        <p
          className={`text-sm font-bold ${onLight ? "text-ink" : "text-white"}`}
        >
          {course.price}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className={`inline-flex min-h-10 items-center rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              onLight
                ? "border border-teal/25 text-teal-dark hover:bg-mist"
                : "border border-white/30 text-white hover:bg-white/10"
            }`}
          >
            View
          </Link>
          <a
            href={enrollHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center rounded-full bg-lime px-4 py-2 text-xs font-semibold text-ink transition-transform hover:scale-[1.03]"
            onClick={() =>
              trackEnrollClick({
                itemId: course.slug,
                itemName: course.title,
                price: course.price,
                location: "course_card",
              })
            }
          >
            Enroll
          </a>
        </div>
      </div>
    </article>
  );
}
