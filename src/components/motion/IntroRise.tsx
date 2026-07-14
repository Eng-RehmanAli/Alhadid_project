"use client";

import { useEffect, useRef, type ReactNode } from "react";

type IntroRiseProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  immediate?: boolean;
};

export function IntroRise({
  children,
  className = "",
  delayMs = 0,
  immediate = false,
}: IntroRiseProps) {
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
      { threshold: 0.15, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs, immediate]);

  return (
    <div ref={ref} className={`intro-rise ${className}`}>
      {children}
    </div>
  );
}
