import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { FellowshipBenefits } from "@/components/FellowshipBenefits";
import { FellowshipForm } from "@/components/FellowshipForm";
import { PageHero } from "@/components/PageHero";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Reveal } from "@/components/motion/Reveal";
import { fellowship } from "@/data/fellowship";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: fellowship.metaTitle,
  description: fellowship.metaDescription,
};

export default function FellowshipPage() {
  return (
    <>
      <PageHero
        eyebrow={fellowship.eyebrow}
        title={fellowship.title}
        description={fellowship.description}
        image={fellowship.heroImage}
        imagePosition="center"
        imageStrength="strong"
      >
        <div className="flex flex-wrap gap-2.5">
          <Button href="#fellowship-form">{fellowship.cta}</Button>
          <Button href="/courses" variant="secondary">
            Browse courses
          </Button>
        </div>
      </PageHero>

      <section className="border-t border-white/10 bg-teal-dark py-12 text-white md:py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <IntroRise>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
              {fellowship.disciplinesLabel}
            </p>
          </IntroRise>
          <IntroRise delayMs={80}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              {fellowship.platformNote}
            </p>
          </IntroRise>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-8">
            {fellowship.disciplines.map((item, i) => (
              <Reveal key={item} delayMs={40 + i * 40}>
                <li className="flex items-center gap-2.5 text-sm text-white/85">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime"
                  />
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FellowshipBenefits />

      <section
        id="fellowship-form"
        className="scroll-mt-[calc(var(--site-header-height)+1rem)] border-t border-line-dark bg-white py-16 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 md:px-8">
          <div>
            <IntroRise>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
                {fellowship.formEyebrow}
              </p>
            </IntroRise>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-teal md:text-4xl">
              <MaskLine>{fellowship.formTitle}</MaskLine>
            </h2>
            <IntroRise delayMs={100}>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
                {fellowship.formIntro}
              </p>
            </IntroRise>
            <IntroRise delayMs={160}>
              <p className="mt-8 text-sm text-muted">
                Questions?{" "}
                <a
                  href={site.contact.emailHref}
                  className="font-semibold text-teal-deep underline-offset-4 hover:underline"
                >
                  {site.contact.email}
                </a>
              </p>
            </IntroRise>
          </div>

          <Reveal delayMs={80}>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-4 -inset-y-4 rounded-[2rem] bg-gradient-to-br from-teal/5 via-transparent to-lime/10 md:-inset-6"
              />
              <div className="relative">
                <FellowshipForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
