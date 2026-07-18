"use client";

import { useMemo, useState, useActionState } from "react";
import Link from "next/link";
import {
  deleteStudentAction,
  forceLogoutAction,
  setStudentDisabledAction,
  type AdminActionState,
} from "@/lib/admin-actions";
import {
  enrollStudentAction,
  type LmsActionState,
} from "@/lib/lms-actions";
import { whatsappGeneralUrl } from "@/lib/whatsapp";

type Student = {
  id: string;
  name: string;
  email: string;
  disabled: boolean;
  createdAt: string | null;
};

const initial: AdminActionState = {};
const enrollInitial: LmsActionState = {};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function ActionMessage({ state }: { state: AdminActionState | LmsActionState }) {
  return (
    <>
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
    </>
  );
}

export function AdminStudentsPanel({
  students,
  courses,
}: {
  students: Student[];
  courses: { slug: string; title: string }[];
}) {
  const [query, setQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [enrollState, enrollAction, enrollPending] = useActionState(
    enrollStudentAction,
    enrollInitial,
  );
  const [forceState, forceAction, forcePending] = useActionState(
    forceLogoutAction,
    initial,
  );
  const [disableState, disableAction, disablePending] = useActionState(
    setStudentDisabledAction,
    initial,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteStudentAction,
    initial,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [students, query]);

  const field =
    "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-teal";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block min-w-0 flex-1">
          <span className="text-sm font-semibold text-ink">
            Search students
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or email…"
            className={field}
          />
        </label>
        <p className="text-sm text-muted">
          Showing {filtered.length} of {students.length}
        </p>
      </div>

      <div className="rounded-2xl border border-line-dark bg-white p-5">
        <h3 className="font-display text-lg font-semibold text-heading">
          Quick enroll from list
        </h3>
        <p className="mt-1 text-sm text-muted">
          Click a student email in the table, then choose a course and enroll.
        </p>
        <form
          action={enrollAction}
          className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <label className="block">
            <span className="text-sm font-semibold text-ink">Student</span>
            <select
              name="email"
              required
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className={field}
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.email}>
                  {s.name} — {s.email}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink">Course</span>
            <select name="courseSlug" required defaultValue="" className={field}>
              <option value="" disabled>
                Select a course
              </option>
              {courses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={enrollPending || !selectedEmail || courses.length === 0}
            className="inline-flex min-h-11 items-center justify-center self-end rounded-full bg-teal-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-deep disabled:opacity-60"
          >
            {enrollPending ? "Enrolling…" : "Enroll"}
          </button>
        </form>
        <div className="mt-3">
          <ActionMessage state={enrollState} />
        </div>
      </div>

      <ActionMessage state={forceState} />
      <ActionMessage state={disableState} />
      <ActionMessage state={deleteState} />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No students match your search.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line-dark bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line-dark text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Signed up</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-dark">
              {filtered.map((student) => {
                const wa = whatsappGeneralUrl(
                  `Assalamualaikum ${student.name}, regarding your Al Hadid account (${student.email}).`,
                );
                return (
                  <tr key={student.id}>
                    <td className="px-5 py-3 font-medium text-ink">
                      {student.name}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        className="text-left text-teal-deep underline-offset-2 hover:underline"
                        onClick={() => setSelectedEmail(student.email)}
                        title="Use for quick enroll"
                      >
                        {student.email}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {student.createdAt
                        ? dateFormat.format(new Date(student.createdAt))
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          student.disabled
                            ? "bg-red-100 text-red-700"
                            : "bg-teal/10 text-teal-deep"
                        }`}
                      >
                        {student.disabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="rounded-full border border-line-dark px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mist"
                        >
                          Progress
                        </Link>
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-line-dark px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mist"
                        >
                          WhatsApp
                        </a>
                        <form action={forceAction}>
                          <input type="hidden" name="userId" value={student.id} />
                          <button
                            type="submit"
                            disabled={forcePending}
                            className="rounded-full border border-line-dark px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mist disabled:opacity-60"
                          >
                            Force logout
                          </button>
                        </form>
                        <form action={disableAction}>
                          <input type="hidden" name="userId" value={student.id} />
                          <input
                            type="hidden"
                            name="disabled"
                            value={student.disabled ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            disabled={disablePending}
                            className="rounded-full border border-line-dark px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mist disabled:opacity-60"
                          >
                            {student.disabled ? "Enable" : "Disable"}
                          </button>
                        </form>
                        <form
                          action={deleteAction}
                          onSubmit={(e) => {
                            if (
                              !confirm(
                                `Delete ${student.name}? This removes enrollments and progress.`,
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="userId" value={student.id} />
                          <button
                            type="submit"
                            disabled={deletePending}
                            className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
