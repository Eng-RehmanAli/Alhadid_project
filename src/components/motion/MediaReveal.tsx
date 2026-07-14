"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MediaRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  immediate?: boolean;
  wide?: boolean;
};

export function MediaReveal({
  children,
  className = "",
  delayMs = 0,
  immediate = false,
  wide = false,
}: MediaRevealProps) {
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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs, immediate]);

  return (
    <div
      ref={ref}
      className={`media-reveal ${wide ? "media-reveal--wide" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
