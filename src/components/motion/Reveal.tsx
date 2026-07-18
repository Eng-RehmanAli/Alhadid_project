"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "up" | "scale" | "line";
};

export function Reveal({
  children,
  className = "",
  delayMs = 0,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => {
      window.setTimeout(() => node.classList.add("is-visible"), delayMs);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      show();
      return;
    }

    // threshold 0: any visible pixel counts. A higher ratio can never be met
    // for sections taller than the viewport, which left admin panels blank.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.unobserve(node);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  const base =
    variant === "scale"
      ? "reveal-scale"
      : variant === "line"
        ? "reveal reveal-line"
        : "reveal";

  return (
    <div ref={ref} className={`${base} ${className}`}>
      {children}
    </div>
  );
}
