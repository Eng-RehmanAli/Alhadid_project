import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { allCourses } from "@/data/courses";
import { faculties, facultyStats, getFaculty } from "@/data/faculties";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return faculties.map((faculty) => ({ slug: faculty.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const faculty = getFaculty(slug);
  if (!faculty) return { title: "Faculty" };
  return {
    title: faculty.title,
    description: faculty.description,
  };
}

export default async function FacultyDetailPage({ params }: Props) {
  const { slug } = await params;
  const faculty = getFaculty(slug);
  if (!faculty) notFound();

  const relatedCourses = allCourses.filter((c) => c.facultySlug === slug);
  const otherFaculties = faculties.filter((f) => f.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow="Faculty"
        title={faculty.title}
        description={faculty.description}
        image={faculty.heroImage}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/courses">View courses</Button>
          {faculty.academy ? (
            <p className="self-center text-sm text-white/65">{faculty.academy}</p>
          ) : null}
        </div>
      </PageHero>

      <section className="bg-mist py-16 text-ink md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          {faculty.registration ? (
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {faculty.registration}
            </p>
          ) : null}

          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:max-w-md lg:grid-cols-2">
            {facultyStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-[family-name:var(--font-display)] text-3xl font-semibold">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
                Overview
              </h2>
              <div className="mt-5 max-w-2xl space-y-4">
                {faculty.overview.map((para) => (
                  <p key={para.slice(0, 48)} className="text-base leading-relaxed text-muted">
                    {para}
                  </p>
                ))}
              </div>

              <h2 className="mt-14 font-[family-name:var(--font-display)] text-3xl font-semibold">
                Philosophy
              </h2>
              <div className="mt-5 max-w-2xl space-y-4">
                {faculty.philosophy.map((para) => (
                  <p key={para.slice(0, 48)} className="text-base leading-relaxed text-muted">
                    {para}
                  </p>
                ))}
              </div>

              <h2 className="mt-14 font-[family-name:var(--font-display)] text-3xl font-semibold">
                How we teach
              </h2>
              <ul className="mt-5 max-w-2xl space-y-3">
                {faculty.approach.map((item) => (
                  <li
                    key={item}
                    className="border-t border-line-dark pt-3 text-base leading-relaxed text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-14 font-[family-name:var(--font-display)] text-3xl font-semibold">
                Key areas of study
              </h2>
              <ul className="mt-6 space-y-6">
                {faculty.keyAreasDetail.map((item) => (
                  <li key={item.title} className="border-t border-line-dark pt-5">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-14 grid gap-10 md:grid-cols-2">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                    Who it is for
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {faculty.whoFor.map((item) => (
                      <li
                        key={item}
                        className="border-t border-line-dark pt-3 text-sm leading-relaxed text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                    What you will gain
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {faculty.outcomes.map((item) => (
                      <li
                        key={item}
                        className="border-t border-line-dark pt-3 text-sm leading-relaxed text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="relative aspect-[4/3] overflow-hidden border border-line-dark">
                <Image
                  src={faculty.heroImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
              <div className="mt-6 border border-line-dark p-6">
                <h3 className="font-semibold">Courses in this faculty</h3>
                <ul className="mt-4 space-y-3">
                  {relatedCourses.map((course) => (
                    <li key={course.slug}>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="text-sm text-ink underline-offset-4 hover:underline"
                      >
                        {course.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button href="/courses" variant="onLight" className="mt-6 w-full">
                  Browse all courses
                </Button>
              </div>
              <div className="mt-6 border border-line-dark p-6">
                <h3 className="font-semibold">Other faculties</h3>
                <ul className="mt-4 space-y-3">
                  {otherFaculties.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/faculties/${item.slug}`}
                        className="text-sm text-ink underline-offset-4 hover:underline"
                      >
                        {item.titleShort ?? item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/faculties"
                  className="mt-5 inline-block text-sm font-semibold text-teal-deep hover:underline hover:underline-offset-4"
                >
                  ← All faculties
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
