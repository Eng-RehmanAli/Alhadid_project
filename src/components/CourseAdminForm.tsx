"use client";

import { useActionState } from "react";
import {
  upsertCourseAction,
  type AdminActionState,
} from "@/lib/admin-actions";

const initial: AdminActionState = {};

export function CourseAdminForm({
  faculties,
}: {
  faculties: { slug: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(upsertCourseAction, initial);
  const field =
    "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-teal";

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <input type="hidden" name="existingSlug" value="" />
      <label className="block">
        <span className="text-sm font-semibold text-ink">Title</span>
        <input name="title" required className={field} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Slug (optional)</span>
        <input name="slug" placeholder="auto-from-title" className={field} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Summary</span>
        <textarea name="summary" required rows={3} className={field} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Price</span>
          <input name="price" defaultValue="Contact" className={field} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Faculty</span>
          <select name="facultySlug" required defaultValue="" className={field}>
            <option value="" disabled>
              Select faculty
            </option>
            {faculties.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Duration</span>
          <input name="duration" placeholder="8 weeks" className={field} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Level</span>
          <input name="level" placeholder="Beginner" className={field} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="featured" className="h-4 w-4" />
        Featured on catalog
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
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-teal-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : "Add course"}
      </button>
    </form>
  );
}
