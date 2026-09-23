"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { NotFoundScreen } from "@/components/NotFoundScreen";
import {
  adjacentFromList,
  fetchPublishedArticle,
  fetchPublishedArticles,
  moreFromWriter,
  postSlugFromPathname,
  relatedFromList,
} from "@/lib/remote-articles";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Article, FeedArticle } from "@/lib/types";

type FoundPost = {
  slug: string;
  article: Article;
  feed: FeedArticle[];
};

function subscribePath(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

export function NotFoundOrLivePost() {
  const pathname = usePathname();
  const browserPath = useSyncExternalStore(
    subscribePath,
    () => window.location.pathname,
    () => "",
  );
  const slug =
    postSlugFromPathname(browserPath) ?? postSlugFromPathname(pathname);
  const configured = isSupabaseConfigured();
  const pathReady = Boolean(browserPath) || pathname !== "/";
  const knownMissing = pathReady && (!slug || !configured);

  const [found, setFound] = useState<FoundPost | null>(null);
  const [failedSlug, setFailedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !configured) return;
    let cancelled = false;
    Promise.all([fetchPublishedArticle(slug), fetchPublishedArticles()])
      .then(([article, feed]) => {
        if (cancelled) return;
        if (!article) {
          setFailedSlug(slug);
          return;
        }
        document.title = `${article.title} | Vice City Feed`;
        setFound({ slug, article, feed });
      })
      .catch(() => {
        if (!cancelled) setFailedSlug(slug);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, configured]);

  if (knownMissing || failedSlug === slug) {
    return <NotFoundScreen />;
  }

  if (found && found.slug === slug) {
    return (
      <ArticleView
        article={found.article}
        related={relatedFromList(found.article, found.feed)}
        adjacent={adjacentFromList(found.article.slug, found.feed)}
        moreFromWriter={moreFromWriter(found.article, found.feed)}
      />
    );
  }

  return (
    <main
      id="main"
      data-live-post-loading={slug ?? "checking"}
      className="mx-auto flex min-h-[62vh] max-w-[720px] flex-col justify-center px-4 py-20 md:px-6"
    >
      <p className="text-[11px] font-bold tracking-[0.16em] text-white uppercase">
        Newswire
      </p>
      <h1 className="font-display mt-5 text-[2.2rem] leading-[1.05] font-extrabold tracking-tight text-white">
        Loading story
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-white">
        Pulling this piece off the desk.
      </p>
    </main>
  );
}
