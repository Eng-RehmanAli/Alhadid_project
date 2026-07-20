"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Light3DBackground } from "@/components/Light3DBackground";
import {
  testimonials,
  testimonialsSection,
  type Testimonial,
} from "@/data/engagement";

const BIO_PREVIEW_LENGTH = 140;

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setCount(3);
      else if (window.matchMedia("(min-width: 768px)").matches) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      {dir === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

function ExpandableBio({
  text,
  onExpandChange,
}: {
  text: string;
  onExpandChange?: (expanded: boolean) => void;
}) {
  const needsTruncate = text.length > BIO_PREVIEW_LENGTH;
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      onExpandChange?.(next);
      return next;
    });
  };

  if (!needsTruncate) {
    return (
      <p className="mt-4 text-[15px] leading-relaxed text-muted">{text}</p>
    );
  }

  const preview = text.slice(0, BIO_PREVIEW_LENGTH).trimEnd();

  return (
    <div className="mt-4">
      <p className="text-[15px] leading-relaxed text-muted">
        {expanded ? text : `${preview}…`}
      </p>
      <button
        type="button"
        onClick={toggle}
        className="mt-2 text-sm font-semibold text-teal-deep transition hover:text-ink"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}

function StudentCard({
  item,
  onExpandChange,
}: {
  item: Testimonial;
  onExpandChange?: (expanded: boolean) => void;
}) {
  return (
    <div className="hover-lift flex h-full flex-col overflow-hidden rounded-3xl border border-line-dark bg-white/90 shadow-[0_12px_36px_rgba(14,106,111,0.06)] backdrop-blur-[2px]">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-teal-deep/10">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={
            item.imagePosition === "top"
              ? "object-cover object-top"
              : "object-cover object-center"
          }
          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-[family-name:var(--font-display)] text-lg font-bold text-ink">
          {item.name}
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-teal-deep">
          {item.role}
        </p>
        {item.bio ? (
          <ExpandableBio text={item.bio} onExpandChange={onExpandChange} />
        ) : null}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const visible = useVisibleCount();
  const maxIndex = Math.max(0, testimonials.length - visible);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (paused || reading || maxIndex === 0) return;
    const id = window.setInterval(goNext, 5000);
    return () => window.clearInterval(id);
  }, [goNext, paused, reading, maxIndex]);

  const slidePercent = 100 / visible;

  return (
    <section className="section-bleed-light light-3d-scene relative py-20 md:py-28">
      <Light3DBackground />
      <div className="relative z-[1] mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <IntroRise>
              <p className="text-sm font-semibold text-teal-deep">
                {testimonialsSection.eyebrow}
              </p>
            </IntroRise>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
              <MaskLine>{testimonialsSection.title}</MaskLine>
            </h2>
            <IntroRise delayMs={120}>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
                {testimonialsSection.subheading}
              </p>
            </IntroRise>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous students"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-dark bg-white text-teal-deep transition hover:border-teal-deep hover:bg-teal-deep hover:text-white"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next students"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-dark bg-white text-teal-deep transition hover:border-teal-deep hover:bg-teal-deep hover:text-white"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        <div
          className="mt-12 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setPaused(false);
            }
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(-${index * slidePercent}%)`,
            }}
          >
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="box-border shrink-0 px-2.5"
                style={{ width: `${slidePercent}%` }}
              >
                <StudentCard item={item} onExpandChange={setReading} />
              </article>
            ))}
          </div>
        </div>

        <div
          className="mt-8 flex justify-center gap-2"
          role="tablist"
          aria-label="Student slides"
        >
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show students starting at ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-7 bg-teal-deep"
                  : "w-2.5 bg-teal-deep/25 hover:bg-teal-deep/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
