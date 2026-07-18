import { Button } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { FacultiesSection } from "@/components/FacultiesSection";
import { FounderPortrait } from "@/components/FounderPortrait";
import { HomeHero } from "@/components/HomeHero";
import { Light3DBackground } from "@/components/Light3DBackground";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Reveal } from "@/components/motion/Reveal";
import { allCourses, featuredCourses } from "@/data/courses";
import { site } from "@/data/site";
import { founder } from "@/data/founder";
import { books, booksPage } from "@/data/books";

const featureStrip = [
  {
    title: site.pillars[0].title,
    description: site.pillars[0].description,
    icon: "01",
    highlight: false,
  },
  {
    title: "Accessible Programs",
    description:
      "Courses from PKR 5000–12000. Registration opens every 10–15 days with limited seats.",
    icon: "02",
    highlight: true,
  },
  {
    title: site.pillars[1].title,
    description: site.pillars[1].description,
    icon: "03",
    highlight: false,
  },
  {
    title: site.pillars[2].title,
    description: site.pillars[2].description,
    icon: "04",
    highlight: false,
  },
];

export default function Home() {
  const featuredBook = books.find((b) => b.featured) ?? books[0];
  const glassStats = [
    { label: "Total Courses", value: `${allCourses.length}+` },
    { label: "Faculties", value: "4" },
    { label: "Students Trained", value: "5,000+" },
  ];

  return (
    <>
      <HomeHero featureStrip={featureStrip} glassStats={glassStats} />

      <FacultiesSection
        eyebrow="Academic Divisions"
        heading="Our Faculties"
        subheading={site.facultiesIntro}
        items={site.faculties.map((faculty, i) => ({
          image: faculty.image,
          number: String(i + 1).padStart(2, "0"),
          title: faculty.title,
          description: faculty.description,
          link: `/faculties/${faculty.slug}`,
        }))}
      />

      <section className="section-bleed-teal grid-scene py-20 md:py-28">
        <Light3DBackground variant="dark" />
        <div className="relative z-[1] mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <IntroRise>
                <p className="text-sm font-semibold text-white/75">Programs</p>
              </IntroRise>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-5xl">
                <MaskLine>
                  Our <span className="text-lime">Courses</span>
                </MaskLine>
              </h2>
            </div>
            <IntroRise delayMs={150}>
              <Button href="/courses">View all courses</Button>
            </IntroRise>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.slice(0, 6).map((course, i) => (
              <Reveal key={course.slug} delayMs={i * 70} variant="scale">
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="section-bleed-light light-3d-scene py-20 md:py-28">
        <Light3DBackground />
        <div className="relative z-[1] mx-auto max-w-6xl px-5 md:px-8">
          <IntroRise>
            <p className="text-sm font-semibold text-teal-deep">Philosophy</p>
          </IntroRise>
          <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            <MaskLine>{site.philosophyTitle}</MaskLine>
          </h2>
          <IntroRise delayMs={140}>
            <div className="mt-6 max-w-3xl space-y-4 text-muted">
              {site.philosophy.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </IntroRise>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {site.pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delayMs={i * 100} variant="scale">
                <div className="hover-lift h-full rounded-3xl border border-line-dark bg-white/90 p-6 shadow-[0_12px_36px_rgba(14,106,111,0.06)] backdrop-blur-[2px]">
                  <p className="text-xs font-bold text-teal-deep">0{i + 1}</p>
                  <h3 className="mt-3 text-xl font-bold">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-bleed-teal grid-scene overflow-x-clip py-20 md:py-24">
        <Light3DBackground variant="dark" />
        <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8 lg:gap-20">
          <div>
            <IntroRise>
              <p className="text-sm font-semibold text-lime">{founder.role}</p>
            </IntroRise>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-4xl">
              <MaskLine>{founder.name}</MaskLine>
            </h2>
            <IntroRise delayMs={120}>
              <p className="mt-4 text-white/75">{founder.summary}</p>
            </IntroRise>
            <IntroRise delayMs={220}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/founder">Meet the founder</Button>
                <Button href={founder.whatsapp} variant="secondary" external>
                  WhatsApp
                </Button>
              </div>
            </IntroRise>
          </div>
          <FounderPortrait />
        </div>
      </section>

      {featuredBook ? (
        <section className="section-bleed-light light-3d-scene py-20 md:py-28">
          <Light3DBackground />
          <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
            <div>
              <IntroRise>
                <p className="text-sm font-semibold text-teal-deep">
                  {booksPage.featuredLabel}
                </p>
              </IntroRise>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
                <MaskLine>{featuredBook.title}</MaskLine>
              </h2>
              <IntroRise delayMs={120}>
                <p className="mt-4 text-muted">{featuredBook.description}</p>
              </IntroRise>
              <IntroRise delayMs={220}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/books" variant="onLight">
                    Explore books
                  </Button>
                  <Button
                    href={booksPage.orderUrl}
                    variant="secondary"
                    external
                    className="!border-teal/30 !text-teal-dark hover:!bg-white"
                  >
                    {booksPage.orderLabel}
                  </Button>
                </div>
              </IntroRise>
            </div>
            <Reveal delayMs={80} variant="scale">
              <div className="hover-lift rounded-3xl bg-white/90 p-8 shadow-[0_16px_40px_rgba(14,106,111,0.12)] backdrop-blur-[2px]">
                <p className="text-sm uppercase tracking-[0.16em] text-muted">
                  {featuredBook.subtitle}
                </p>
                <p className="mt-3 font-semibold">{featuredBook.author}</p>
                <ul className="mt-6 space-y-3">
                  {featuredBook.highlights.slice(0, 3).map((h) => (
                    <li
                      key={h}
                      className="border-t border-line-dark pt-3 text-sm text-muted"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="section-bleed-teal grid-scene py-20 md:py-24">
        <Light3DBackground variant="dark" />
        <div className="relative z-[1] mx-auto max-w-4xl px-5 text-center md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-5xl">
            <MaskLine>
              {site.ctaTitle.split("transformation")[0]}
              <span className="text-lime">transformation</span>
            </MaskLine>
          </h2>
          <IntroRise delayMs={140}>
            <p className="mx-auto mt-5 max-w-2xl text-white/75">{site.ctaBody}</p>
          </IntroRise>
          <IntroRise delayMs={240}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button href="/courses">View courses</Button>
              <Button href="/contact" variant="secondary">
                Contact us
              </Button>
            </div>
          </IntroRise>
        </div>
      </section>
    </>
  );
}
