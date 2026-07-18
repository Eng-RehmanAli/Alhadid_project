"use client";

import { useActionState } from "react";
import {
  deleteContactMessageAction,
  deleteWaitlistEntryAction,
  type AdminActionState,
} from "@/lib/admin-actions";

const initial: AdminActionState = {};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function ContactMessagesPanel({
  messages,
}: {
  messages: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string | null;
  }[];
}) {
  const [state, action, pending] = useActionState(
    deleteContactMessageAction,
    initial,
  );

  return (
    <div className="space-y-4">
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
      {messages.length === 0 ? (
        <p className="text-sm text-muted">No contact messages yet.</p>
      ) : (
        <ul className="divide-y divide-line-dark rounded-2xl border border-line-dark bg-white">
          {messages.map((msg) => (
            <li key={msg.id} className="space-y-2 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    {msg.name}{" "}
                    <span className="text-sm font-normal text-muted">
                      ({msg.email})
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-heading">
                    {msg.subject}
                  </p>
                </div>
                <form action={action}>
                  <input type="hidden" name="messageId" value={msg.id} />
                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </form>
              </div>
              <p className="whitespace-pre-wrap text-sm text-muted">
                {msg.message}
              </p>
              <p className="text-xs text-muted">
                {msg.createdAt
                  ? dateFormat.format(new Date(msg.createdAt))
                  : "—"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function WaitlistPanel({
  entries,
}: {
  entries: {
    id: string;
    name: string;
    createdAt: string | null;
  }[];
}) {
  const [state, action, pending] = useActionState(
    deleteWaitlistEntryAction,
    initial,
  );

  return (
    <div className="space-y-4">
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
      {entries.length === 0 ? (
        <p className="text-sm text-muted">Waitlist is empty.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line-dark bg-white">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-line-dark text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-dark">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-5 py-3 font-medium text-ink">
                    {entry.name}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {entry.createdAt
                      ? dateFormat.format(new Date(entry.createdAt))
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <form action={action}>
                      <input type="hidden" name="entryId" value={entry.id} />
                      <button
                        type="submit"
                        disabled={pending}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
