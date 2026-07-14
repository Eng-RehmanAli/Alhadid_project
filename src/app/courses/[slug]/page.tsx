import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/CourseCard";
import { CourseEnrollPanel } from "@/components/CourseEnrollPanel";
import { PageHero } from "@/components/PageHero";
import {
  allCourses,
  getCourse,
  getRelatedCourses,
} from "@/data/courses";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allCourses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course" };
  return {
    title: course.title,
    description: course.summary,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  // #region agent log
  fetch("http://127.0.0.1:7647/ingest/35628f31-76ca-430a-95e6-9b69094f15b3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "c227a6",
    },
    body: JSON.stringify({
      sessionId: "c227a6",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "courses/[slug]/page.tsx:entry",
      message: "Course detail page server render started",
      data: { slug },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  const course = getCourse(slug);
  if (!course) notFound();

  const related = getRelatedCourses(slug);
  const image =
    course.image ||
    "https://images.unsplash.com/photo-1456513080800-7d93dbe9ad5e?auto=format&fit=crop&w=2400&q=80";

  // #region agent log
  fetch("http://127.0.0.1:7647/ingest/35628f31-76ca-430a-95e6-9b69094f15b3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "c227a6",
    },
    body: JSON.stringify({
      sessionId: "c227a6",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "courses/[slug]/page.tsx:before-enroll",
      message: "About to render CourseEnrollPanel",
      data: {
        slug: course.slug,
        relatedCount: related.length,
        enrollPanelImported: typeof CourseEnrollPanel,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.summary,
    provider: {
      "@type": "Organization",
      name: "Al Hadid Muslims Network",
      sameAs: "https://alhadid.org",
    },
    offers: {
      "@type": "Offer",
      category: "Paid",
      priceCurrency: "PKR",
      price: course.price.replace(/[^\d]/g, "") || undefined,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={course.facultyTitle}
        title={course.title}
        description={course.summary}
        image={image}
        compact
      >
        <nav aria-label="Breadcrumb" className="text-sm text-white/55">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/courses" className="hover:text-white">
            Courses
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/85">{course.title}</span>
        </nav>
      </PageHero>

      <section className="bg-mist py-14 text-ink md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_320px] md:px-8">
          <div>
            {course.image ? (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden border border-line-dark">
                <Image
                  src={course.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 720px"
                />
              </div>
            ) : null}

            <section id="overview">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold md:text-3xl">
                Overview
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                {course.summary}. This program is part of the{" "}
                <Link
                  href={`/faculties/${course.facultySlug}`}
                  className="text-ink underline underline-offset-4"
                >
                  {course.facultyTitle}
                </Link>{" "}
                faculty at Al Hadid.
              </p>
            </section>

            {course.outcomes?.length ? (
              <section id="outcomes" className="mt-12">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                  What you will gain
                </h2>
                <ul className="mt-6 space-y-3">
                  {course.outcomes.map((item) => (
                    <li
                      key={item}
                      className="border-t border-line-dark pt-3 text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {course.modules?.length ? (
              <section id="syllabus" className="mt-12">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                  Syllabus
                </h2>
                <ol className="mt-6 space-y-3">
                  {course.modules.map((item, index) => (
                    <li
                      key={item}
                      className="flex gap-4 border-t border-line-dark pt-3"
                    >
                      <span className="font-[family-name:var(--font-display)] text-white-dim text-lg text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-ink">{item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>

          <CourseEnrollPanel course={course} />
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-line bg-teal-dark py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white md:text-3xl">
              Related courses
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <CourseCard key={item.slug} course={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
