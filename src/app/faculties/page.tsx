import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { FacultiesSection } from "@/components/FacultiesSection";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import {
  faculties,
  facultiesListingHero,
  facultiesPage,
} from "@/data/faculties";

export const metadata: Metadata = {
  title: "Faculties",
  description: facultiesPage.description,
};

export default function FacultiesPage() {
  return (
    <>
      <PageHero
        eyebrow={facultiesPage.eyebrow}
        title={facultiesPage.title}
        description={facultiesPage.description}
        image={facultiesListingHero}
        imagePosition="right"
      >
        <Button href="/courses">View courses</Button>
      </PageHero>

      <section className="bg-mist py-16 text-ink md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <IntroRise>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
              {facultiesPage.introEyebrow}
            </p>
          </IntroRise>
          <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
            <MaskLine>{facultiesPage.introTitle}</MaskLine>
          </h2>
          <div className="mt-4 h-px w-16 bg-teal/40" aria-hidden />

          <IntroRise delayMs={120}>
            <div className="mt-8 max-w-3xl space-y-5">
              {facultiesPage.intro.map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="text-base leading-relaxed text-muted md:text-[1.05rem]"
                >
                  {para}
                </p>
              ))}
            </div>
          </IntroRise>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {faculties.map((faculty, i) => (
              <Reveal key={faculty.slug} delayMs={i * 80} variant="scale">
                <Link
                  href={`/faculties/${faculty.slug}`}
                  className="group block border-t border-line-dark pt-4 transition-colors hover:border-teal"
                >
                  <p className="text-xs font-bold tracking-[0.16em] text-teal-deep">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug group-hover:text-teal-deep">
                    {faculty.titleShort ?? faculty.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>

          <IntroRise delayMs={220}>
            <p className="mt-10 max-w-xl border-l-2 border-teal/35 pl-4 text-sm leading-relaxed text-muted">
              {facultiesPage.enrollmentNote}
            </p>
          </IntroRise>
        </div>
      </section>

      <FacultiesSection
        showIntro
        eyebrow="Explore divisions"
        heading="Browse the faculties"
        subheading="Visual pathways into each division — open a faculty to read its philosophy, key areas, and related courses."
        className="section-bleed-light"
        items={faculties.map((faculty, i) => ({
          image: faculty.heroImage,
          number: String(i + 1).padStart(2, "0"),
          title: faculty.title,
          description: faculty.description,
          link: `/faculties/${faculty.slug}`,
        }))}
      />

      <section className="bg-mist py-16 text-ink md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <IntroRise>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
              Connected learning
            </p>
          </IntroRise>
          <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
            <MaskLine>{facultiesPage.integrationTitle}</MaskLine>
          </h2>
          <IntroRise delayMs={120}>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted">
              {facultiesPage.integrationBody}
            </p>
          </IntroRise>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {faculties.map((faculty, i) => (
              <Reveal key={faculty.slug} delayMs={i * 90}>
                <Link
                  href={`/faculties/${faculty.slug}`}
                  className="group block border-t border-line-dark pt-6 transition-opacity hover:opacity-80"
                >
                  <p className="text-xs font-bold tracking-[0.16em] text-teal-deep">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                    {faculty.titleShort ?? faculty.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {faculty.overview[0]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-deep transition-transform group-hover:translate-x-0.5">
                    Read more
                    <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <IntroRise delayMs={180}>
            <div className="mt-14">
              <Button href="/courses" variant="onLight">
                Browse all courses
              </Button>
            </div>
          </IntroRise>
        </div>
      </section>
    </>
  );
}
