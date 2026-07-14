import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Reveal } from "@/components/motion/Reveal";
import { articles, articlesHeroImage, articlesPage } from "@/data/articles";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Articles",
  description: articlesPage.metaDescription,
};

function facultyTitle(slug?: string) {
  if (!slug) return null;
  return site.faculties.find((f) => f.slug === slug)?.title ?? null;
}

export default function ArticlesPage() {
  const [featured, ...rest] = articles;
  const featuredFaculty = facultyTitle(featured?.facultySlug);

  return (
    <>
      <PageHero
        eyebrow={articlesPage.archiveLabel}
        title={articlesPage.title}
        description={articlesPage.description}
        image={articlesHeroImage}
      />

      <section className="bg-mist py-16 text-ink md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <IntroRise>
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              {articlesPage.archiveIntro}
            </p>
          </IntroRise>

          {articles.length === 0 ? (
            <p className="mt-10 text-muted">{articlesPage.emptyMessage}</p>
          ) : (
            <div className="mt-12">
              {featured ? (
                <Reveal variant="scale">
                  <Link
                    href={`/articles/${featured.slug}`}
                    className="group hover-lift block rounded-3xl border border-line-dark bg-white/90 p-6 shadow-[0_16px_40px_rgba(14,106,111,0.1)] md:p-10"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
                      {featured.publishedDate}
                      {featuredFaculty ? ` · ${featuredFaculty}` : null}
                    </p>
                    <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold md:text-3xl">
                      <MaskLine>{featured.title}</MaskLine>
                    </h2>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
                      {featured.excerpt}
                    </p>
                    <p className="mt-6 text-sm font-semibold text-teal-deep transition-colors group-hover:text-ink">
                      Read article →
                    </p>
                  </Link>
                </Reveal>
              ) : null}

              {rest.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {rest.map((article, i) => {
                    const faculty = facultyTitle(article.facultySlug);
                    return (
                      <Reveal
                        key={article.slug}
                        delayMs={80 + i * 90}
                        variant="scale"
                      >
                        <Link
                          href={`/articles/${article.slug}`}
                          className="group hover-lift flex h-full flex-col rounded-3xl border border-line-dark bg-white/90 p-6 shadow-[0_12px_36px_rgba(14,106,111,0.06)]"
                        >
                          <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            {article.publishedDate}
                            {faculty ? ` · ${faculty}` : null}
                          </p>
                          <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold">
                            {article.title}
                          </h2>
                          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                            {article.excerpt}
                          </p>
                          <p className="mt-5 text-sm font-semibold text-teal-deep transition-colors group-hover:text-ink">
                            Read article →
                          </p>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-20">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              <MaskLine>{articlesPage.themesLabel}</MaskLine>
            </h2>
            <IntroRise delayMs={80}>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                {articlesPage.themesIntro}
              </p>
            </IntroRise>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {site.faculties.map((faculty, i) => (
                <Reveal key={faculty.slug} delayMs={i * 80} variant="scale">
                  <Link
                    href={`/faculties/${faculty.slug}`}
                    className="group hover-lift flex h-full flex-col rounded-3xl border border-line-dark bg-white/90 p-5 shadow-[0_12px_36px_rgba(14,106,111,0.06)]"
                  >
                    <p className="text-sm font-semibold transition-colors group-hover:text-teal-deep">
                      {faculty.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {faculty.description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
