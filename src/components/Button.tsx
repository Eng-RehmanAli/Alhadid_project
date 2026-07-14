import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "onLight" | "dark";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full bg-lime text-ink hover:bg-lime-soft focus-visible:outline-lime lime-glow shadow-[0_10px_30px_rgba(200,255,74,0.28)]",
  secondary:
    "rounded-full border border-white/40 text-white hover:border-white hover:bg-white/10 focus-visible:outline-white",
  ghost:
    "rounded-full text-white/85 hover:text-white underline-offset-4 hover:underline focus-visible:outline-white",
  onLight:
    "rounded-full bg-teal-dark text-white hover:bg-teal-deep focus-visible:outline-teal",
  dark: "rounded-full bg-ink text-white hover:bg-black focus-visible:outline-ink",
};

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  onClick?: ComponentProps<"a">["onClick"];
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  onClick,
}: ButtonProps) {
  const classes = `btn-shine inline-flex min-h-11 items-center justify-center px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 sm:px-7 ${variants[variant]} ${className}`;

  if (
    external ||
    href.startsWith("http") ||
    href.startsWith("mailto") ||
    href.startsWith("tel")
  ) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
