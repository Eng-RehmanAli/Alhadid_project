"use client";

import { useState } from "react";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { fellowship } from "@/data/fellowship";

export function FellowshipBenefits() {
  const [active, setActive] = useState(0);
  const current = fellowship.benefits[active];

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-teal-dark text-white"
      aria-label={fellowship.benefitsTitle}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(31,148,153,0.45),transparent_55%),radial-gradient(ellipse_at_85%_80%,rgba(200,255,74,0.12),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black/20 to-transparent"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:gap-14 md:px-8 md:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
        <div>
          <IntroRise>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
              {fellowship.benefitsLabel}
            </p>
          </IntroRise>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            <MaskLine>{fellowship.benefitsTitle}</MaskLine>
          </h2>
          <div
            className="mt-5 h-px w-14 bg-gradient-to-r from-lime to-lime/0"
            aria-hidden
          />

          <div
            key={current.title}
            className="mt-10 animate-fade-in"
          >
            <p
              aria-hidden
              className="font-[family-name:var(--font-display)] text-7xl font-bold leading-none tracking-tight text-white/10 md:text-8xl"
            >
              {String(active + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-lime md:text-3xl">
              {current.title}
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              {current.description}
            </p>
          </div>
        </div>

        <div role="list" className="flex flex-col">
          {fellowship.benefits.map((benefit, i) => {
            const selected = i === active;
            return (
              <button
                key={benefit.title}
                type="button"
                role="listitem"
                aria-current={selected ? "true" : undefined}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group relative flex items-center gap-4 border-t border-white/10 px-1 py-4 text-left transition-all duration-300 last:border-b focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:gap-5 md:py-5 ${
                  selected ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-0.5 origin-center transition-all duration-300 ${
                    selected
                      ? "scale-y-100 bg-lime"
                      : "scale-y-0 bg-lime/60 group-hover:scale-y-50"
                  }`}
                />
                <span
                  className={`w-8 shrink-0 font-mono text-xs tabular-nums tracking-wider transition-colors duration-300 ${
                    selected ? "text-lime" : "text-white/35"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`min-w-0 flex-1 font-[family-name:var(--font-display)] text-lg font-semibold transition-colors duration-300 md:text-xl ${
                    selected ? "text-white" : "text-white/55 group-hover:text-white/80"
                  }`}
                >
                  {benefit.title}
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-lime transition-all duration-300 ${
                    selected
                      ? "translate-x-0 opacity-100"
                      : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                  }`}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
