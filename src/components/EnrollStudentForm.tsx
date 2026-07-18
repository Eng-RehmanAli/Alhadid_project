"use client";

import { useActionState, useEffect, useState } from "react";
import {
  enrollStudentAction,
  type LmsActionState,
} from "@/lib/lms-actions";

const initial: LmsActionState = {};

export function EnrollStudentForm({
  courses,
  students = [],
  defaultEmail = "",
  formId = "admin-enroll-form",
}: {
  courses: { slug: string; title: string }[];
  students?: { name: string; email: string }[];
  defaultEmail?: string;
  formId?: string;
}) {
  const [state, action, pending] = useActionState(enrollStudentAction, initial);
  const [email, setEmail] = useState(defaultEmail);

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  const field =
    "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-teal";

  return (
    <form id={formId} action={action} className="space-y-4">
      {students.length > 0 ? (
        <label className="block">
          <span className="text-sm font-semibold text-ink">
            Pick student (or type email)
          </span>
          <select
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          >
            <option value="">Type email below, or select…</option>
            {students.map((s) => (
              <option key={s.email} value={s.email}>
                {s.name} — {s.email}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="block">
        <span className="text-sm font-semibold text-ink">Student email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@example.com"
          className={field}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-ink">Course</span>
        <select name="courseSlug" required defaultValue="" className={field}>
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course.slug} value={course.slug}>
              {course.title}
            </option>
          ))}
        </select>
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="text-sm text-teal-deep">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || courses.length === 0}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-teal-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-deep disabled:opacity-60"
      >
        {pending ? "Enrolling…" : "Enroll student"}
      </button>
    </form>
  );
}
