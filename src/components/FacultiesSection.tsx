import Image from "next/image";
import Link from "next/link";
import { IntroRise } from "@/components/motion/IntroRise";
import { Light3DBackground } from "@/components/Light3DBackground";
import { MaskLine } from "@/components/motion/MaskLine";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal } from "@/components/motion/Reveal";

export type FacultyDivisionItem = {
  image: string;
  number: string;
  title: string;
  description: string;
  link: string;
  focus?: string;
};

type FacultiesSectionProps = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items: FacultyDivisionItem[];
  className?: string;
  showIntro?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
};

export function FacultiesSection({
  eyebrow = "Academic Divisions",
  heading = "Our Faculties",
  subheading,
  items,
  className = "",
  showIntro = true,
  ctaHref = "/faculties",
  ctaLabel = "View all faculties",
}: FacultiesSectionProps) {
  return (
    <section
      className={`light-3d-scene text-ink ${
        showIntro ? "pb-20 pt-16 md:pb-28 md:pt-20" : "py-16 md:py-24"
      } ${className}`}
      aria-label="Faculties"
    >
      <Light3DBackground />

      <div className="relative z-[1] mx-auto max-w-6xl px-5 md:px-8">
        {showIntro ? (
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <IntroRise>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
                  {eyebrow}
                </p>
              </IntroRise>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
                <MaskLine>{heading}</MaskLine>
              </h2>
              <div className="mt-4 h-px w-14 bg-teal/40" aria-hidden />
              {subheading ? (
                <IntroRise delayMs={120}>
                  <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">
                    {subheading}
                  </p>
                </IntroRise>
              ) : null}
            </div>

            <IntroRise delayMs={180}>
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-deep transition-colors duration-300 hover:text-teal"
              >
                {ctaLabel}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </IntroRise>
          </div>
        ) : null}

        <div
          className={`mx-auto grid max-w-[960px] grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-x-[88px] md:gap-y-[120px] md:pb-32 ${
            showIntro ? "mt-14 md:mt-16" : ""
          }`}
        >
          {items.map((item, i) => {
            const isRightColumn = i % 2 === 1;

            return (
              <article
                key={`${item.number}-${item.title}`}
                className={`w-full ${isRightColumn ? "md:mt-[120px]" : ""}`}
              >
                <Link href={item.link} className="group block w-full">
                  <MediaReveal delayMs={i * 90} className="faculty-float">
                    <div className="relative aspect-square w-full overflow-hidden rounded-[6px] shadow-[0_24px_48px_-28px_rgba(10,79,83,0.35)] transition-shadow duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_36px_64px_-20px_rgba(10,79,83,0.45)]">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="(max-width: 767px) 90vw, 420px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"
                        aria-hidden
                      />
                      <span
                        aria-hidden
                        className="absolute bottom-5 left-5 font-[family-name:var(--font-display)] text-5xl font-bold leading-none tracking-tight text-white/90 md:text-6xl"
                      >
                        {item.number}
                      </span>
                    </div>
                  </MediaReveal>

                  <Reveal delayMs={100 + i * 70}>
                    <div className="mt-6">
                      {item.focus ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                          {item.focus}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold tracking-wide text-teal-deep">
                          {item.number}
                        </p>
                      )}

                      <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-display)] text-[22px] font-bold leading-snug tracking-tight transition-colors duration-300 group-hover:text-teal-deep md:text-[26px]">
                        {item.title}
                      </h3>

                      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-deep transition-colors duration-300 group-hover:text-teal group-hover:underline group-hover:underline-offset-4">
                        Explore division
                        <span
                          aria-hidden
                          className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </Reveal>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
