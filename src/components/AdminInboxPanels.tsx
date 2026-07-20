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
    age: number | null;
    city: string | null;
    profession: string | null;
    whatsapp: string | null;
    email: string | null;
    university: string | null;
    source: string | null;
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
        <ul className="divide-y divide-line-dark rounded-2xl border border-line-dark bg-white">
          {entries.map((entry) => (
            <li key={entry.id} className="space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{entry.name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {entry.createdAt
                      ? dateFormat.format(new Date(entry.createdAt))
                      : "—"}
                    {entry.source ? ` · ${entry.source}` : ""}
                  </p>
                </div>
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
              </div>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                {entry.age != null ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      Age
                    </dt>
                    <dd className="mt-0.5 text-ink">{entry.age}</dd>
                  </div>
                ) : null}
                {entry.city ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      City
                    </dt>
                    <dd className="mt-0.5 text-ink">{entry.city}</dd>
                  </div>
                ) : null}
                {entry.profession ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      Profession
                    </dt>
                    <dd className="mt-0.5 text-ink">{entry.profession}</dd>
                  </div>
                ) : null}
                {entry.whatsapp ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      WhatsApp
                    </dt>
                    <dd className="mt-0.5 text-ink">{entry.whatsapp}</dd>
                  </div>
                ) : null}
                {entry.email ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      Email
                    </dt>
                    <dd className="mt-0.5 break-all text-ink">{entry.email}</dd>
                  </div>
                ) : null}
                {entry.university ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      University
                    </dt>
                    <dd className="mt-0.5 text-ink">{entry.university}</dd>
                  </div>
                ) : null}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
