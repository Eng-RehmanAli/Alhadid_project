"use client";

import { useActionState } from "react";
import {
  completeLessonAction,
  type LmsActionState,
} from "@/lib/lms-actions";

const initial: LmsActionState = {};

export function CompleteLessonButton({
  courseSlug,
  lessonSlug,
  completed,
}: {
  courseSlug: string;
  lessonSlug: string;
  completed: boolean;
}) {
  const [state, action, pending] = useActionState(completeLessonAction, initial);

  if (completed) {
    return (
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-deep">
        <span aria-hidden>✓</span> Completed
      </p>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="courseSlug" value={courseSlug} />
      <input type="hidden" name="lessonSlug" value={lessonSlug} />
      {state.error ? (
        <p role="alert" className="mb-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Mark complete"}
      </button>
    </form>
  );
}
