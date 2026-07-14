"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";
import { trackEnrollClick, trackViewItem } from "@/lib/analytics";
import { whatsappEnrollUrl } from "@/lib/whatsapp";
import type { CourseWithFaculty } from "@/data/courses";

// #region agent log
fetch("http://127.0.0.1:7647/ingest/35628f31-76ca-430a-95e6-9b69094f15b3", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "c227a6",
  },
  body: JSON.stringify({
    sessionId: "c227a6",
    runId: "pre-fix",
    hypothesisId: "C",
    location: "CourseEnrollPanel.tsx:module",
    message: "CourseEnrollPanel module factory evaluated",
    data: { side: "client-module" },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

export function CourseEnrollPanel({ course }: { course: CourseWithFaculty }) {
  // #region agent log
  fetch("http://127.0.0.1:7647/ingest/35628f31-76ca-430a-95e6-9b69094f15b3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "c227a6",
    },
    body: JSON.stringify({
      sessionId: "c227a6",
      runId: "pre-fix",
      hypothesisId: "D",
      location: "CourseEnrollPanel.tsx:render",
      message: "CourseEnrollPanel render entry",
      data: { slug: course.slug, hasTitle: Boolean(course.title) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const enrollHref = whatsappEnrollUrl(course.title);

  useEffect(() => {
    trackViewItem({
      itemId: course.slug,
      itemName: course.title,
      price: course.price,
      category: course.facultyTitle,
    });
  }, [course]);

  return (
    <aside className="rounded-3xl border border-line-dark bg-white p-5 text-ink shadow-[0_12px_40px_rgba(14,106,111,0.1)] sm:p-6 md:sticky md:top-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-deep">
        Enrollment
      </p>
      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <p className="break-words font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
          {course.price}
        </p>
      </div>

      <dl className="mt-6 space-y-3 border-t border-line-dark pt-5 text-sm">
        {course.duration ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Duration</dt>
            <dd className="text-right font-medium">{course.duration}</dd>
          </div>
        ) : null}
        {course.level ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Level</dt>
            <dd className="text-right font-medium">{course.level}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-muted">Faculty</dt>
          <dd className="text-right font-medium">{course.facultyTitle}</dd>
        </div>
      </dl>

      <Button
        href={enrollHref}
        external
        className="mt-6 w-full"
        onClick={() =>
          trackEnrollClick({
            itemId: course.slug,
            itemName: course.title,
            price: course.price,
            location: "course_detail",
          })
        }
      >
        Enroll Now
      </Button>
      <p className="mt-3 text-center text-xs text-muted">
        Registration via WhatsApp · Limited seats
      </p>
    </aside>
  );
}
