"use client";

import { useActionState } from "react";
import {
  bulkEnrollAction,
  type AdminActionState,
} from "@/lib/admin-actions";

const initial: AdminActionState = {};

export function BulkEnrollForm({
  courses,
}: {
  courses: { slug: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(bulkEnrollAction, initial);
  const field =
    "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-teal";

  return (
    <form action={action} className="space-y-4">
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

      <label className="block">
        <span className="text-sm font-semibold text-ink">
          Student emails (one per line, or comma-separated)
        </span>
        <textarea
          name="emails"
          required
          rows={5}
          placeholder={"student1@example.com\nstudent2@example.com"}
          className={field}
        />
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
        {pending ? "Enrolling…" : "Bulk enroll"}
      </button>
    </form>
  );
}
