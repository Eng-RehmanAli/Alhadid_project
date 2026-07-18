"use client";

import { useActionState } from "react";
import {
  setUserRoleAction,
  type LmsActionState,
} from "@/lib/lms-actions";

const initial: LmsActionState = {};

export function SetUserRoleForm() {
  const [state, action, pending] = useActionState(setUserRoleAction, initial);

  const field =
    "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-teal";

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm font-semibold text-ink">User email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="user@example.com"
          className={field}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-ink">Role</span>
        <select name="role" required defaultValue="student" className={field}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
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
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-teal-deep px-5 py-2.5 text-sm font-semibold text-teal-deep hover:bg-mist disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update role"}
      </button>
    </form>
  );
}
