"use client";

import { useEffect, useRef, type ReactNode } from "react";

type StatPopProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  immediate?: boolean;
};

export function StatPop({
  children,
  className = "",
  delayMs = 0,
  immediate = false,
}: StatPopProps) {
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs, immediate]);

  return (
    <div ref={ref} className={`stat-pop ${className}`}>
      {children}
    </div>
  );
}
