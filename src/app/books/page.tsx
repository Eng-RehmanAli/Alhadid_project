import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Reveal } from "@/components/motion/Reveal";
import { books, booksHeroImage, booksPage, getFeaturedBook } from "@/data/books";

export const metadata: Metadata = {
  title: "Books",
  description: booksPage.metaDescription,
};

export default function BooksPage() {
  const featured = getFeaturedBook();
  const others = books.filter((b) => b.slug !== featured?.slug);

  return (
    <>
      <PageHero
        eyebrow="Publications"
        title={booksPage.title}
        description={booksPage.description}
        image={booksHeroImage}
        imagePosition="bottom"
      />

      <section className="bg-mist py-16 text-ink md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          {featured ? (
            <article className="rounded-3xl border border-line-dark bg-white/90 p-6 shadow-[0_16px_40px_rgba(14,106,111,0.1)] md:p-10">
              <IntroRise>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
                  {booksPage.featuredLabel}
                </p>
              </IntroRise>
              <h2 className="relative mt-4 inline-block max-w-full font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0 rounded-md bg-mist"
                />
                <span className="relative z-10 block px-3 py-1.5">
                  <MaskLine>{featured.title}</MaskLine>
                </span>
              </h2>
              <IntroRise delayMs={80}>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-muted">
                  {featured.subtitle}
                </p>
                <p className="mt-2 text-sm text-muted">{featured.author}</p>
                <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
                  {featured.description}
                </p>
              </IntroRise>

              <div className="mt-10 grid gap-10 md:grid-cols-2">
                <div>
                  <IntroRise>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
                      <MaskLine>{booksPage.highlightsLabel}</MaskLine>
                    </h3>
                  </IntroRise>
                  <div className="mt-4 space-y-3">
                    {featured.highlights.map((item, i) => (
                      <Reveal key={item} delayMs={120 + i * 90} variant="scale">
                        <div className="hover-lift rounded-2xl border border-line-dark bg-white p-4 text-sm leading-relaxed text-muted shadow-[0_12px_36px_rgba(14,106,111,0.06)]">
                          {item}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
                <div>
                  <IntroRise delayMs={80}>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
                      <MaskLine delayMs={80}>{booksPage.praiseLabel}</MaskLine>
                    </h3>
                  </IntroRise>
                  <div className="mt-4 space-y-3">
                    {featured.praise.map((item, i) => (
                      <Reveal key={item} delayMs={160 + i * 90} variant="scale">
                        <div className="hover-lift rounded-2xl border border-line-dark bg-white p-4 text-sm leading-relaxed text-muted shadow-[0_12px_36px_rgba(14,106,111,0.06)]">
                          “{item}”
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {featured.prices.map((price, i) => (
                  <Reveal key={price.label} delayMs={i * 90} variant="scale">
                    <div className="hover-lift rounded-2xl border border-teal/20 bg-white p-5 shadow-[0_12px_36px_rgba(14,106,111,0.08)]">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">
                        {price.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-teal-deep">
                        {price.amount}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <IntroRise delayMs={160}>
                <p className="mt-6 text-sm text-muted">{booksPage.limitedNote}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={booksPage.orderUrl} variant="onLight" external>
                    {booksPage.orderLabel}
                  </Button>
                </div>
              </IntroRise>
            </article>
          ) : null}

          <div className="mt-16">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              <MaskLine>{booksPage.otherLabel}</MaskLine>
            </h2>
            {others.length === 0 ? (
              <IntroRise delayMs={80}>
                <p className="mt-4 text-muted">{booksPage.emptyOther}</p>
              </IntroRise>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {others.map((book, i) => (
                  <Reveal key={book.slug} delayMs={i * 90} variant="scale">
                    <article className="hover-lift h-full rounded-3xl border border-line-dark bg-white/90 p-6 shadow-[0_12px_36px_rgba(14,106,111,0.06)]">
                      <h3 className="text-xl font-semibold">{book.title}</h3>
                      <p className="mt-2 text-sm text-muted">{book.author}</p>
                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        {book.description}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
