"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  joinFellowshipWaitlistAction,
  type FellowshipWaitlistState,
} from "@/lib/fellowship-actions";
import { track } from "@/lib/analytics";
import { fellowship } from "@/data/fellowship";

const initial: FellowshipWaitlistState = {};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-4 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/70 hover:border-teal/30 focus:border-teal focus:ring-4 focus:ring-teal/10";

export function FellowshipForm() {
  const [state, action, pending] = useActionState(
    joinFellowshipWaitlistAction,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const trackedSuccess = useRef(false);

  useEffect(() => {
    if (state.success && !trackedSuccess.current) {
      trackedSuccess.current = true;
      track("generate_lead", { form_id: "fellowship_waitlist" });
      formRef.current?.reset();
    }
    if (!state.success) {
      trackedSuccess.current = false;
    }
  }, [state.success]);

  if (state.success) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-teal/20 bg-mist px-6 py-10 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-deep">
          Confirmed
        </p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-teal">
          You&apos;re in the Fellowship
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          {state.success}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Full Name
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            maxLength={80}
            placeholder="Your full name"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Age
          </span>
          <input
            type="number"
            name="age"
            required
            min={14}
            max={100}
            inputMode="numeric"
            placeholder="e.g. 24"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            City
          </span>
          <input
            type="text"
            name="city"
            required
            autoComplete="address-level2"
            maxLength={120}
            placeholder="Your city"
            className={fieldClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Profession / Field of Study
          </span>
          <input
            type="text"
            name="profession"
            required
            maxLength={120}
            placeholder="e.g. MBBS student, Nutritionist, Herbalist"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            WhatsApp Number
          </span>
          <input
            type="tel"
            name="whatsapp"
            required
            autoComplete="tel"
            maxLength={24}
            placeholder="+92 3XX XXXXXXX"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Gmail Address
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@gmail.com"
            className={fieldClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            University / College Name
          </span>
          <input
            type="text"
            name="university"
            required
            maxLength={120}
            placeholder="Your institution"
            className={fieldClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-shine group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full bg-teal-dark px-7 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-teal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-teal disabled:opacity-60"
        >
          <span>{pending ? "Submitting…" : fellowship.cta}</span>
          <svg
            viewBox="0 0 24 24"
            className="ml-0 h-3.5 w-0 opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:w-3.5 group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </button>
        <p className="text-xs text-muted">
          We&apos;ll only use your details for platform updates.
        </p>
      </div>
    </form>
  );
}
