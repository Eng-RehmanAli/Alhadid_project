import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { CoursesCatalog } from "@/components/CoursesCatalog";
import { PageHero } from "@/components/PageHero";
import { coursesHeroImage, coursesPage } from "@/data/courses";
import { founder } from "@/data/founder";

export const metadata: Metadata = {
  title: "Courses",
  description: coursesPage.description,
};

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title={coursesPage.title}
        description={coursesPage.description}
        image={coursesHeroImage}
        imagePosition="right"
      >
        <div className="flex flex-wrap gap-3">
          <Button href={founder.whatsapp} external>
            {coursesPage.applyLabel}
          </Button>
          <p className="self-center text-sm text-white/65">
            {coursesPage.priceRange} · {coursesPage.seatsNote}
          </p>
        </div>
      </PageHero>

      <section className="bg-mist py-16 text-ink md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted">
            {coursesPage.enrollmentNote}
          </p>
          <CoursesCatalog />
        </div>
      </section>
    </>
  );
}
