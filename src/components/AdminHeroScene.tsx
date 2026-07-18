"use client";

import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";

type AdminHeroSceneProps = {
  name: string;
};

export function AdminHeroScene({ name }: AdminHeroSceneProps) {
  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <div className="relative isolate min-h-[11rem] w-full max-w-sm shrink-0 self-stretch sm:min-h-[12.5rem] md:w-[min(100%,20rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-0 h-36 w-36 rounded-full bg-lime/15 blur-3xl admin-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-2xl admin-hero-glow-delayed"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] rounded-full opacity-40 orbit-ring admin-hero-orbit"
      />

      <span
        aria-hidden
        className="admin-hero-orb absolute left-[12%] top-[18%] h-2.5 w-2.5 rounded-full bg-lime/80"
      />
      <span
        aria-hidden
        className="admin-hero-orb-b absolute right-[16%] top-[28%] h-2 w-2 rounded-full bg-white/70"
      />
      <span
        aria-hidden
        className="admin-hero-orb-c absolute bottom-[22%] left-[22%] h-1.5 w-1.5 rounded-full bg-lime/60"
      />

      <div className="relative flex h-full flex-col items-start justify-center py-2 md:items-end md:text-right">
        <IntroRise immediate delayMs={200}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-lime">
            Welcome back
          </p>
        </IntroRise>

        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          <MaskLine immediate delayMs={360} className="admin-hero-name">
            {name}
          </MaskLine>
        </h2>

        <IntroRise immediate delayMs={520}>
          <p className="mt-2 max-w-[16rem] text-sm text-white/65 md:ml-auto">
            {firstName}, you&apos;re signed in with full admin access.
          </p>
        </IntroRise>

        <IntroRise immediate delayMs={640}>
          <div
            aria-hidden
            className="admin-hero-underline mt-4 h-px w-24 origin-left bg-gradient-to-r from-lime via-lime/50 to-transparent md:ml-auto md:origin-right"
          />
        </IntroRise>
      </div>
    </div>
  );
}
