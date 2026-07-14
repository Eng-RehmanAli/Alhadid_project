import Image from "next/image";
import Link from "next/link";
import { IntroRise } from "@/components/motion/IntroRise";
import { Light3DBackground } from "@/components/Light3DBackground";
import { MaskLine } from "@/components/motion/MaskLine";

export type FacultyDivisionItem = {
  image: string;
  number: string;
  title: string;
  description: string;
  link: string;
};

type FacultiesSectionProps = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items: FacultyDivisionItem[];
  className?: string;
  showIntro?: boolean;
};

export function FacultiesSection({
  eyebrow = "Academic Divisions",
  heading = "Our Faculties",
  subheading,
  items,
  className = "",
  showIntro = true,
}: FacultiesSectionProps) {
  return (
    <section
      className={`light-3d-scene text-ink ${
        showIntro ? "pb-20 pt-28 md:pb-28 md:pt-36" : "py-16 md:py-24"
      } ${className}`}
      aria-label="Faculties"
    >
      <Light3DBackground />

      <div className="relative z-[1] mx-auto max-w-6xl px-5 md:px-8">
        {showIntro ? (
          <div>
            <IntroRise>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
                {eyebrow}
              </p>
            </IntroRise>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
              <MaskLine>{heading}</MaskLine>
            </h2>
            {subheading ? (
              <IntroRise delayMs={120}>
                <p className="mt-4 max-w-[500px] text-[15px] leading-relaxed text-[#6B6B6B]">
                  {subheading}
                </p>
              </IntroRise>
            ) : null}
          </div>
        ) : null}

        <div
          className={`mx-auto grid max-w-[960px] grid-cols-1 items-start gap-14 md:grid-cols-2 md:gap-x-[100px] md:gap-y-[160px] md:pb-40 ${
            showIntro ? "mt-16 md:mt-20" : ""
          }`}
        >
          {items.map((item, i) => {
            const isRightColumn = i % 2 === 1;

            return (
              <article
                key={`${item.number}-${item.title}`}
                className={`w-full ${isRightColumn ? "md:mt-[160px]" : ""}`}
              >
                <Link href={item.link} className="group block w-full">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[6px] shadow-[0_24px_48px_-28px_rgba(10,79,83,0.35)] transition-[box-shadow,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_32px_56px_-24px_rgba(10,79,83,0.4)]">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(max-width: 767px) 90vw, 420px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold tracking-wide text-teal-deep">
                      {item.number}
                    </p>

                    <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-display)] text-[22px] font-bold leading-snug tracking-tight md:text-[26px]">
                      {item.title}
                    </h3>

                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-[#6B6B6B]">
                      {item.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-deep transition-colors duration-300 group-hover:text-teal group-hover:underline group-hover:underline-offset-4">
                      Explore Division
                      <span
                        aria-hidden
                        className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
