"use client";

import { FormEvent, useState } from "react";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Light3DBackground } from "@/components/Light3DBackground";
import { waitlist } from "@/data/engagement";
import { track } from "@/lib/analytics";
import { whatsappGeneralUrl } from "@/lib/whatsapp";

export function WaitlistSection() {
  const [name, setName] = useState("");

  function openWaitlist(e?: FormEvent) {
    e?.preventDefault();
    const href = whatsappGeneralUrl(
      `${waitlist.messagePrefix} ${name.trim() || "___"}.`,
    );
    track("waitlist_click", {
      location: "home_waitlist",
      has_name: Boolean(name.trim()),
    });
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="section-bleed-light light-3d-scene relative py-20 md:py-24">
      <Light3DBackground />
      <div className="relative z-[1] mx-auto max-w-3xl px-5 text-center md:px-8">
        <IntroRise>
          <p className="text-sm font-semibold text-teal-deep">{waitlist.eyebrow}</p>
        </IntroRise>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
          <MaskLine>{waitlist.title}</MaskLine>
        </h2>
        <IntroRise delayMs={120}>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            {waitlist.body}
          </p>
        </IntroRise>

        <form
          onSubmit={openWaitlist}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <label className="sr-only" htmlFor="waitlist-name">
            Your name
          </label>
          <input
            id="waitlist-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder={waitlist.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-12 flex-1 rounded-full border border-line-dark bg-white/90 px-5 text-sm text-ink outline-none placeholder:text-muted focus:border-teal focus:ring-4 focus:ring-teal/10"
          />
          <button
            type="submit"
            className="btn-shine inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-teal-dark px-6 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:bg-teal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-teal"
          >
            {waitlist.cta}
          </button>
        </form>
        <p className="mt-3 text-xs text-muted">
          Opens WhatsApp with your message — direct to Al Hadid, no email spam.
        </p>
      </div>
    </section>
  );
}
