import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal } from "@/components/motion/Reveal";
import {
  aboutApproachFaculties,
  aboutHeroImage,
  aboutPage,
  aboutPillars,
} from "@/data/about";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: aboutPage.metaDescription,
};

function ZigzagImage({
  src,
  alt = "",
  priority = false,
}: {
  src: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_16px_40px_rgba(14,106,111,0.12)]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

export default function AboutPage() {
  const approachRows = aboutApproachFaculties.map((item) => {
    const faculty = site.faculties.find((f) => f.slug === item.slug);
    return {
      ...item,
      title: faculty?.title ?? item.slug,
      image: faculty?.image ?? aboutHeroImage,
    };
  });

  return (
    <>
      <PageHero
        eyebrow={site.networkTagline}
        title={aboutPage.title}
        description={aboutPage.description}
        image={aboutHeroImage}
        imagePosition="center"
        imageStrength="strong"
      />

      <section className="bg-mist py-16 text-ink md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          {/* Philosophy — text left / image right */}
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <IntroRise>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
                  {aboutPage.philosophyLabel}
                </p>
              </IntroRise>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-teal md:text-4xl">
                <MaskLine>{aboutPage.philosophyTitle}</MaskLine>
              </h2>
              <IntroRise delayMs={100}>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
                  <p>{aboutPage.philosophyLead}</p>
                  <p>{aboutPage.philosophyIntegration}</p>
                </div>
              </IntroRise>
            </div>
            <MediaReveal delayMs={80}>
              <ZigzagImage src={aboutPage.philosophyImage} priority />
            </MediaReveal>
          </div>

          {/* Name meaning — image left / text right (reversed on desktop) */}
          <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-2 md:gap-14">
            <div className="md:order-2">
              <IntroRise>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
                  {aboutPage.nameLabel}
                </p>
              </IntroRise>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-teal md:text-4xl">
                <MaskLine>{aboutPage.nameTitle}</MaskLine>
              </h2>
              <IntroRise delayMs={100}>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  {aboutPage.nameBody}
                </p>
              </IntroRise>
            </div>
            <MediaReveal delayMs={80} className="md:order-1">
              <ZigzagImage src={aboutPage.nameImage} />
            </MediaReveal>
          </div>

          {/* Mission / Vision / Values */}
          <div className="mt-20 md:mt-28">
            <IntroRise>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
                {aboutPage.pillarsLabel}
              </p>
            </IntroRise>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {aboutPillars.map((pillar, i) => (
                <Reveal key={pillar.title} delayMs={i * 90} variant="scale">
                  <div className="hover-lift h-full rounded-3xl border border-line-dark bg-white/90 p-6 shadow-[0_12px_36px_rgba(14,106,111,0.06)] md:p-7">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-teal">
                      {pillar.title}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Approach intro + faculty zigzag */}
          <div className="mt-20 md:mt-28">
            <IntroRise>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
                {aboutPage.approachLabel}
              </p>
            </IntroRise>
            <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-semibold text-teal md:text-4xl">
              <MaskLine>{aboutPage.approachTitle}</MaskLine>
            </h2>
            <IntroRise delayMs={100}>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
                {aboutPage.approachIntro}
              </p>
            </IntroRise>

            <div className="mt-14 space-y-16 md:space-y-24">
              {approachRows.map((row, i) => {
                const imageFirst = i % 2 === 1;
                return (
                  <div
                    key={row.slug}
                    className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
                  >
                    <div className={imageFirst ? "md:order-2" : undefined}>
                      <Reveal delayMs={40}>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                          Faculty {String(i + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-teal md:text-3xl">
                          {row.title}
                        </h3>
                        <p className="mt-4 text-base leading-relaxed text-muted">
                          {row.blurb}
                        </p>
                        <Link
                          href={`/faculties/${row.slug}`}
                          className="mt-6 inline-flex text-sm font-semibold text-teal-deep transition-colors hover:text-ink"
                        >
                          Explore faculty →
                        </Link>
                      </Reveal>
                    </div>
                    <MediaReveal
                      delayMs={80}
                      className={imageFirst ? "md:order-1" : undefined}
                    >
                      <Link
                        href={`/faculties/${row.slug}`}
                        className="group hover-lift block"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_16px_40px_rgba(14,106,111,0.12)]">
                          <Image
                            src={row.image}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                      </Link>
                    </MediaReveal>
                  </div>
                );
              })}
            </div>

            <IntroRise delayMs={80}>
              <p className="mt-16 max-w-3xl text-base leading-relaxed text-muted md:mt-20">
                {aboutPage.approachClosing}
              </p>
            </IntroRise>
          </div>

          {/* Technology partnership — Al Hadid × TechCognify */}
          <div
            id="technology-partner"
            className="mt-20 scroll-mt-28 md:mt-28"
          >
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <IntroRise>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
                    {aboutPage.partnershipLabel}
                  </p>
                </IntroRise>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-teal md:text-4xl">
                  <MaskLine>{aboutPage.partnershipTitle}</MaskLine>
                </h2>
                <IntroRise delayMs={100}>
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
                    <p>{aboutPage.partnershipLead}</p>
                    <p>{aboutPage.partnershipBody}</p>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-teal-deep">
                    {aboutPage.partnershipDate}
                  </p>
                  <div className="mt-8">
                    <Button
                      href={aboutPage.partnershipCtaHref}
                      variant="onLight"
                      external
                    >
                      {aboutPage.partnershipCtaLabel}
                    </Button>
                  </div>
                </IntroRise>
              </div>
              <MediaReveal delayMs={80}>
                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-[0_16px_40px_rgba(14,106,111,0.12)]">
                  <Image
                    src={aboutPage.partnershipImage}
                    alt="Collaboration announcement between Al Hadid and TechCognify — signing of the LMS partnership"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              </MediaReveal>
            </div>
          </div>

          {/* Closing + CTAs */}
          <div className="mt-20 rounded-3xl border border-line-dark bg-white/90 p-8 shadow-[0_16px_40px_rgba(14,106,111,0.08)] md:mt-28 md:p-10">
            <IntroRise>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-teal">
                {aboutPage.closingTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                {aboutPage.closingBody}
              </p>
            </IntroRise>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/courses" variant="onLight">
                Browse courses
              </Button>
              <Button
                href="/founder"
                variant="secondary"
                className="!border-ink/25 !text-ink hover:!border-ink hover:!bg-ink/5"
              >
                Meet the founder
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
