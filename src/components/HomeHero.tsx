"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { CountUp } from "@/components/motion/CountUp";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StatPop } from "@/components/motion/StatPop";
import { TiltCard } from "@/components/motion/TiltCard";
import { site } from "@/data/site";
import { testimonials } from "@/data/engagement";

const heroImage =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";

const heroAvatars = testimonials.slice(0, 3);

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  highlight: boolean;
};

type HomeHeroProps = {
  featureStrip: FeatureItem[];
  glassStats: { label: string; value: string }[];
};

export function HomeHero({ featureStrip, glassStats }: HomeHeroProps) {
  const headlineLead = site.heroHeadline.split("meaningful change")[0];

  return (
    <section className="relative isolate overflow-hidden grid-scene text-white">
      <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-teal-dark/50 blur-3xl" />

      {/* Fills the viewport below the site header */}
      <div className="relative mx-auto flex min-h-[calc(100dvh-var(--site-header-height))] max-w-6xl items-center px-5 py-8 md:px-8 md:py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <IntroRise immediate delayMs={80}>
              <p className="text-sm font-semibold text-white/75">
                {site.networkTagline}
              </p>
            </IntroRise>

            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[2.15rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]">
              <MaskLine immediate delayMs={160}>
                {headlineLead.trim()}
              </MaskLine>
              <MaskLine immediate delayMs={320} className="text-lime">
                meaningful change
              </MaskLine>
            </h1>

            <IntroRise immediate delayMs={480}>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
                {site.description}
              </p>
            </IntroRise>

            <IntroRise immediate delayMs={620}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/courses">Get Started Now</Button>
                <Button href="/faculties" variant="secondary">
                  Explore Faculties
                </Button>
              </div>
            </IntroRise>

            <IntroRise immediate delayMs={760}>
              <div className="mt-10 flex items-center gap-3 sm:gap-4">
                <div className="flex shrink-0 -space-x-3">
                  {heroAvatars.map((person, i) => (
                    <span
                      key={person.name}
                      className="relative inline-block h-9 w-9 overflow-hidden rounded-full border-2 border-teal bg-teal-deep sm:h-10 sm:w-10"
                      style={{ zIndex: 3 - i }}
                      title={person.name}
                    >
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        className="object-cover object-top"
                        sizes="40px"
                      />
                    </span>
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    <span className="text-lime">{site.stats[0].value}</span>{" "}
                    Students Trained
                  </p>
                  <p className="text-xs text-white/60">
                    {site.stats[1].value} active learners · {site.tagline}
                  </p>
                </div>
              </div>
            </IntroRise>
          </div>

          <div className="relative mx-auto w-full max-w-[360px] perspective-[1200px] sm:max-w-md lg:max-w-none">
            <div className="pointer-events-none absolute inset-8 hidden rounded-full opacity-40 orbit-ring sm:block" />
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[min(420px,calc((100dvh-var(--site-header-height)-6rem)*0.8))]">
              <MediaReveal
                immediate
                delayMs={280}
                className="absolute inset-x-4 bottom-0 top-8 sm:inset-x-6 sm:top-10"
              >
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/20 bg-teal-deep/40 shadow-[0_30px_80px_rgba(0,40,45,0.45)] sm:rounded-[2.75rem]">
                  <Image
                    src={heroImage}
                    alt="Al Hadid students learning together"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 90vw, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/50 via-transparent to-transparent" />
                </div>
              </MediaReveal>

              <StatPop
                immediate
                delayMs={780}
                className="absolute left-0 top-6 z-10 w-[48%] min-w-0 sm:-left-4 sm:top-8 sm:w-[48%] lg:-left-6"
              >
                <TiltCard float className="rounded-2xl p-3 sm:p-4">
                  <p className="stat-value font-[family-name:var(--font-display)] font-extrabold">
                    <CountUp value={glassStats[0].value} />
                  </p>
                  <p className="stat-label text-[0.65rem] font-bold uppercase sm:text-xs">
                    {glassStats[0].label}
                  </p>
                </TiltCard>
              </StatPop>

              <StatPop
                immediate
                delayMs={900}
                className="absolute right-0 top-[38%] z-10 w-[48%] min-w-0 sm:-right-4 sm:w-[48%] lg:-right-8"
              >
                <TiltCard float className="rounded-2xl p-3 sm:p-4" maxTilt={12}>
                  <p className="stat-value font-[family-name:var(--font-display)] font-extrabold">
                    <CountUp value={glassStats[1].value} />
                  </p>
                  <p className="stat-label text-[0.65rem] font-bold uppercase sm:text-xs">
                    {glassStats[1].label}
                  </p>
                </TiltCard>
              </StatPop>

              <StatPop
                immediate
                delayMs={1020}
                className="absolute bottom-4 left-[4%] z-10 w-[72%] min-w-0 sm:bottom-10 sm:left-[2%] sm:w-[64%]"
              >
                <TiltCard float className="rounded-2xl p-3 sm:p-4" maxTilt={8}>
                  <p className="stat-value font-[family-name:var(--font-display)] font-extrabold">
                    <CountUp value={glassStats[2].value} />
                  </p>
                  <p className="stat-label text-[0.65rem] font-bold uppercase sm:text-xs">
                    {glassStats[2].label}
                  </p>
                </TiltCard>
              </StatPop>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-4 max-w-6xl px-5 pb-12 pt-4 md:mt-6 md:px-8 md:pb-16 md:pt-6">
        <Reveal variant="scale">
          <div className="grid gap-2 rounded-[1.75rem] border border-white/40 bg-white p-3 text-ink shadow-[0_24px_60px_rgba(0,40,45,0.18)] sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:p-2">
            {featureStrip.map((item) => (
              <div
                key={item.title}
                className={`rounded-[1.35rem] p-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:p-5 ${
                  item.highlight
                    ? "bg-lime shadow-[0_12px_30px_rgba(200,255,74,0.28)]"
                    : "bg-transparent"
                }`}
              >
                <div
                  className={`mb-4 grid h-10 w-10 place-items-center rounded-xl text-sm font-bold ${
                    item.highlight
                      ? "bg-ink text-lime"
                      : "bg-mist text-teal-deep"
                  }`}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
