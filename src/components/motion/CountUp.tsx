"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: string;
  className?: string;
};

function parseStat(value: string) {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return { target: 0, suffix: value, prefix: "" };
  return {
    target: Number(match[1].replace(/,/g, "")),
    suffix: match[2] || "",
    prefix: "",
  };
}

export function CountUp({ value, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { target, suffix } = parseStat(value);
  const [display, setDisplay] = useState(target === 0 ? value : "0");

  useEffect(() => {
    const node = ref.current;
    if (!node || target === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let started = false;

    const run = () => {
      const duration = 900;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        setDisplay(`${current.toLocaleString()}${suffix}`);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
