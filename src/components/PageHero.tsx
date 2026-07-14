import Image from "next/image";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  image?: string;
  /** Bias photo crop when text sits on the left (e.g. listing heroes). */
  imagePosition?: "center" | "right" | "bottom";
  /** How strongly the photo shows through the teal wash. */
  imageStrength?: "default" | "strong";
  children?: ReactNode;
  compact?: boolean;
};

const imagePositionClass = {
  center: "object-center",
  right: "object-right",
  bottom: "object-bottom",
} as const;

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imagePosition = "center",
  imageStrength = "default",
  children,
  compact = false,
}: PageHeroProps) {
  const strong = imageStrength === "strong";

  return (
    <section
      className={`relative isolate overflow-hidden grid-scene text-white ${
        compact ? "pt-6 pb-14 md:pt-10 md:pb-16" : "pt-8 pb-16 md:pt-12 md:pb-20"
      }`}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover ${
              strong ? "opacity-55" : "opacity-40"
            } ${imagePositionClass[imagePosition]}`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              strong
                ? "from-teal-dark/88 via-teal/68 to-teal-mid/45"
                : "from-teal-dark/92 via-teal/72 to-teal-mid/35"
            }`}
          />
          {strong ? (
            <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/50 via-transparent to-teal-dark/25" />
          ) : null}
        </>
      ) : null}

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        {eyebrow ? (
          <p className="text-sm font-semibold text-white/70">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl break-words font-[family-name:var(--font-display)] text-[2.15rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
