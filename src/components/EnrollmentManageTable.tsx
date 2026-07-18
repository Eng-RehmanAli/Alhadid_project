"use client";

import { useActionState } from "react";
import {
  setEnrollmentStatusAction,
  type AdminActionState,
} from "@/lib/admin-actions";

const initial: AdminActionState = {};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function statusBadge(status: string) {
  if (status === "active") return "bg-teal/10 text-teal-deep";
  if (status === "completed") return "bg-lime/25 text-ink";
  return "bg-red-100 text-red-700";
}

export function EnrollmentManageTable({
  enrollments,
}: {
  enrollments: {
    enrollmentId: string;
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    status: string;
    enrolledAt: string;
  }[];
}) {
  const [state, action, pending] = useActionState(
    setEnrollmentStatusAction,
    initial,
  );

  if (enrollments.length === 0) {
    return <p className="mt-4 text-sm text-muted">No enrollments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-line-dark bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line-dark text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Enrolled</th>
              <th className="px-5 py-3">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-dark">
            {enrollments.map((row) => (
              <tr key={row.enrollmentId}>
                <td className="px-5 py-3">
                  <span className="block font-medium text-ink">
                    {row.studentName}
                  </span>
                  <span className="block text-xs text-muted">
                    {row.studentEmail}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink">{row.courseTitle}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusBadge(row.status)}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted">
                  {dateFormat.format(new Date(row.enrolledAt))}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-2">
                    {row.status !== "active" ? (
                      <form action={action}>
                        <input
                          type="hidden"
                          name="enrollmentId"
                          value={row.enrollmentId}
                        />
                        <input type="hidden" name="status" value="active" />
                        <button
                          type="submit"
                          disabled={pending}
                          className="rounded-full border border-teal-deep px-3 py-1.5 text-xs font-semibold text-teal-deep hover:bg-mist disabled:opacity-60"
                        >
                          Re-activate
                        </button>
                      </form>
                    ) : null}
                    {row.status !== "revoked" ? (
                      <form action={action}>
                        <input
                          type="hidden"
                          name="enrollmentId"
                          value={row.enrollmentId}
                        />
                        <input type="hidden" name="status" value="revoked" />
                        <button
                          type="submit"
                          disabled={pending}
                          className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Revoke
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
