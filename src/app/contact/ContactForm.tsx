"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";

type ContactFormProps = {
  emailHref: string;
};

export default function ContactForm({ emailHref }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");

    const mailto = `${emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    track("generate_lead", { form_id: "contact" });
    window.location.href = mailto;
    setStatus("ready");
    form.reset();
  }

  const field =
    "mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/35 hover:border-white/25 focus:border-lime/60 focus:bg-white/10 focus:ring-2 focus:ring-lime/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate={false}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/50">
            Name
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/50">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="your.email@example.com"
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/50">
          Subject
        </span>
        <input
          type="text"
          name="subject"
          required
          placeholder="Inquiry subject"
          className={field}
        />
      </label>

      <label className="block">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/50">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={3}
          placeholder="Your message…"
          className={`${field} min-h-[72px] resize-y`}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-0.5">
        <button
          type="submit"
          className="btn-shine group relative inline-flex min-h-10 items-center justify-center overflow-hidden rounded-full bg-lime px-5 py-2.5 text-sm font-semibold tracking-wide text-ink transition-all duration-300 hover:bg-lime-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lime"
        >
          <span>Send message</span>
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
        {status === "ready" ? (
          <p className="text-xs text-white/55">
            Your email client should open shortly.
          </p>
        ) : (
          <p className="text-xs text-white/55">Opens your email app to send.</p>
        )}
      </div>
    </form>
  );
}
