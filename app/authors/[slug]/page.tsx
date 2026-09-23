import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { LiveAuthorFeed } from "@/components/LiveAuthorFeed";
import {
  getAllAuthorSlugs,
  getAuthor,
  getFeedArticlesByAuthor,
} from "@/lib/articles";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllAuthorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: "Not found" };
  return {
    title: author.name,
    description: `Stories by ${author.name}.`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const articles = getFeedArticlesByAuthor(slug);

  return (
    <main
      id="main"
      data-author-page={slug}
      className="mx-auto max-w-7xl px-4 pt-28 pb-12 md:px-6 md:pt-32"
    >
      <PageHeader
        kicker="Newswire"
        title={author.name}
        description={`Stories by ${author.name}.`}
      />
      <LiveAuthorFeed authorSlug={slug} articles={articles} />
    </main>
  );
}
