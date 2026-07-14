"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MaskLineProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /** Play on mount (hero). Default: wait for scroll into view */
  immediate?: boolean;
};

export function MaskLine({
  children,
  className = "",
  delayMs = 0,
  immediate = false,
}: MaskLineProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.classList.add("is-visible");
      return;
    }

    const show = () => {
      window.setTimeout(() => node.classList.add("is-visible"), delayMs);
    };

    if (immediate) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.unobserve(node);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs, immediate]);

  return (
    <span ref={ref} className={`mask-line ${className}`}>
      <span className="mask-line__inner">{children}</span>
    </span>
  );
}
