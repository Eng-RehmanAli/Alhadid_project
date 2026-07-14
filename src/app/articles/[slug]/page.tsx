import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { articles, getArticle } from "@/data/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <PageHero
        eyebrow={article.author}
        title={article.title}
        description={article.excerpt}
        compact
      >
        <nav aria-label="Breadcrumb" className="text-sm text-white/55">
          <Link href="/articles" className="hover:text-white">
            Articles
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/85">{article.title}</span>
        </nav>
        <p className="mt-4 text-sm text-white/55">{article.publishedDate}</p>
      </PageHero>

      <article className="bg-mist py-16 text-ink md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="space-y-6 text-base leading-relaxed text-muted">
            {article.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          {article.facultySlug ? (
            <p className="mt-12 border-t border-line-dark pt-6 text-sm">
              Related faculty:{" "}
              <Link
                href={`/faculties/${article.facultySlug}`}
                className="font-semibold text-ink underline underline-offset-4"
              >
                Explore
              </Link>
            </p>
          ) : null}
        </div>
      </article>
    </>
  );
}
