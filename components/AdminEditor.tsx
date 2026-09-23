"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { CoverArt } from "@/components/CoverArt";
import { ctaPillClass, outlinePillClass } from "@/components/pills";
import { describeAdminError } from "@/lib/admin-errors";
import { slugify } from "@/lib/format";
import {
  categoryToAccent,
  categoryToSection,
  emptyDraft,
  fetchAdminArticle,
  rowToDraft,
  saveArticle,
  uploadCoverImage,
  type ArticleDraft,
} from "@/lib/remote-articles";
import { CATEGORY_SECTION, coverKind } from "@/lib/site";
import {
  CATEGORIES,
  COVER_SCENES,
  SECTION_SLUGS,
  type Category,
  type CoverAccent,
  type CoverScene,
  type SectionSlug,
} from "@/lib/types";

const ACCENTS: CoverAccent[] = ["cyan", "magenta", "sunset"];

const fieldClass =
  "w-full rounded-xl bg-raised px-4 py-3 text-white placeholder:text-white/40";
const labelClass =
  "mb-2 block text-[10px] font-semibold tracking-[0.16em] text-white uppercase";

type AdminEditorProps = {
  slug?: string;
};

type Notice = {
  kind: "draft" | "published";
  slug: string;
  title: string;
};

export function AdminEditor({ slug }: AdminEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<ArticleDraft>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetchAdminArticle(slug)
      .then((row) => {
        if (cancelled) return;
        if (!row) {
          setError("That draft is not on the desk.");
          setLoading(false);
          return;
        }
        setDraft(rowToDraft(row));
        setSlugTouched(true);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(describeAdminError(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function patch(partial: Partial<ArticleDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function onTitle(title: string) {
    setDraft((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title),
    }));
  }

  function onCategory(category: Category) {
    setDraft((current) => ({
      ...current,
      category,
      section: current.sectionManual
        ? current.section
        : categoryToSection(category),
      coverAccent: categoryToAccent(category),
    }));
  }

  async function onUpload(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadCoverImage(draft.slug || draft.title || "story", file);
      patch({ coverImageUrl: url });
    } catch (err) {
      setError(describeAdminError(err));
    } finally {
      setUploading(false);
    }
  }

  async function onSave(publish: boolean) {
    if (!draft.title.trim()) {
      setError("Add a title before saving.");
      return;
    }
    if (publish && !draft.authorName.trim()) {
      setError("Add an author name before publishing.");
      return;
    }
    setSaving(publish ? "publish" : "draft");
    setError(null);
    setNotice(null);
    try {
      const next = { ...draft, published: publish };
      if (!next.sectionManual) {
        next.section = categoryToSection(next.category);
      }
      const nextSlug = await saveArticle(next);
      setDraft((current) => ({ ...current, ...next, slug: nextSlug }));
      setSlugTouched(true);
      setNotice({
        kind: publish ? "published" : "draft",
        slug: nextSlug,
        title: next.title.trim(),
      });
      router.replace(`/admin/write/?slug=${encodeURIComponent(nextSlug)}`);
    } catch (err) {
      setError(describeAdminError(err));
    } finally {
      setSaving(null);
    }
  }

  const busy = Boolean(saving) || uploading;
  const desk = CATEGORY_SECTION[draft.category];

  if (loading) {
    return (
      <div data-admin-editor-loading className="space-y-4">
        <div className="h-16 rounded-2xl bg-surface" />
        <div className="h-24 rounded-2xl bg-surface" />
        <div className="h-72 rounded-2xl bg-surface" />
        <p className="text-sm text-white">Loading draft…</p>
      </div>
    );
  }

  return (
    <form
      data-admin-editor
      className="space-y-8 pb-28"
      onSubmit={(event) => {
        event.preventDefault();
        void onSave(false);
      }}
    >
      {notice ? (
        <div
          data-admin-success={notice.kind}
          className="rounded-2xl bg-surface px-5 py-5"
          role="status"
        >
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
            {notice.kind === "published" ? "On the wire" : "Desk"}
          </p>
          <p className="font-display mt-2 text-2xl font-extrabold tracking-tight text-white">
            {notice.kind === "published"
              ? `${notice.title} is live.`
              : `${notice.title} is saved as a draft.`}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {notice.kind === "published" ? (
              <Link
                href={`/posts/${notice.slug}/`}
                className={ctaPillClass("white")}
              >
                View story
              </Link>
            ) : null}
            <Link href="/admin/" className={outlinePillClass("px-5")}>
              Back to desk
            </Link>
          </div>
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="admin-title">
          Title
        </label>
        <input
          id="admin-title"
          className="w-full bg-transparent font-display text-[1.8rem] leading-[1.1] font-extrabold tracking-tight text-white placeholder:text-white/35 md:text-4xl"
          value={draft.title}
          onChange={(event) => onTitle(event.target.value)}
          placeholder="Headline"
        />
        {draft.slug ? (
          <p className="mt-2 text-xs font-medium text-white/70">
            /posts/{draft.slug}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="admin-excerpt">
          Excerpt
        </label>
        <textarea
          id="admin-excerpt"
          className={`${fieldClass} min-h-24`}
          value={draft.excerpt}
          onChange={(event) => patch({ excerpt: event.target.value })}
          placeholder="One line for the card and the search result."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="admin-body">
            Body
          </label>
          <textarea
            id="admin-body"
            className={`${fieldClass} min-h-80 font-mono text-sm md:min-h-[28rem]`}
            value={draft.content}
            onChange={(event) => patch({ content: event.target.value })}
            placeholder="Write in markdown. The preview updates as you type."
          />
        </div>
        <div>
          <p className={labelClass}>Preview</p>
          <div
            data-admin-preview
            className="min-h-80 rounded-2xl bg-surface px-5 py-6 md:min-h-[28rem]"
          >
            {draft.content.trim() ? (
              <ArticleBody
                markdown={draft.content}
                figure={{
                  accent: draft.coverAccent,
                  scene: draft.coverScene,
                  title: draft.title || "Cover",
                  caption: draft.excerpt,
                  kind: coverKind(draft.category),
                }}
              />
            ) : (
              <p className="text-sm text-white">The story preview lands here.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="admin-category">
            Desk
          </label>
          <select
            id="admin-category"
            className={fieldClass}
            value={draft.category}
            onChange={(event) => onCategory(event.target.value as Category)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category} — {CATEGORY_SECTION[category].label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs font-medium text-white/70">
            Files to {desk.label}.
          </p>
        </div>
        <div>
          <label className={labelClass} htmlFor="admin-author">
            Author
          </label>
          <input
            id="admin-author"
            className={fieldClass}
            value={draft.authorName}
            onChange={(event) => patch({ authorName: event.target.value })}
            placeholder="Byline"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="admin-cover-file">
          Cover
        </label>
        <div className="overflow-hidden rounded-2xl bg-surface">
          <CoverArt
            accent={draft.coverAccent}
            scene={draft.coverScene}
            title={draft.title || "Cover"}
            imageUrl={draft.coverImageUrl || undefined}
            className="aspect-video"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className={ctaPillClass("white", "cursor-pointer")}>
            {uploading ? "Uploading…" : draft.coverImageUrl ? "Replace image" : "Upload image"}
            <input
              id="admin-cover-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={busy}
              onChange={(event) => void onUpload(event.target.files?.[0])}
            />
          </label>
          {draft.coverImageUrl ? (
            <button
              type="button"
              className={outlinePillClass("px-5")}
              onClick={() => patch({ coverImageUrl: "" })}
            >
              Use scene art
            </button>
          ) : null}
        </div>
      </div>

      <details className="rounded-2xl bg-surface px-5 py-4">
        <summary className="cursor-pointer text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
          Advanced
        </summary>
        <div className="mt-5 space-y-5">
          <div>
            <label className={labelClass} htmlFor="admin-slug">
              Slug
            </label>
            <input
              id="admin-slug"
              className={fieldClass}
              value={draft.slug}
              onChange={(event) => {
                setSlugTouched(true);
                patch({ slug: slugify(event.target.value) });
              }}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="admin-section">
                Section
              </label>
              <select
                id="admin-section"
                className={fieldClass}
                value={draft.section}
                onChange={(event) =>
                  patch({
                    section: event.target.value as SectionSlug,
                    sectionManual: true,
                  })
                }
              >
                {SECTION_SLUGS.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="admin-role">
                Author role
              </label>
              <input
                id="admin-role"
                className={fieldClass}
                value={draft.authorRole}
                onChange={(event) => patch({ authorRole: event.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="admin-tags">
              Tags
            </label>
            <input
              id="admin-tags"
              className={fieldClass}
              value={draft.tags}
              onChange={(event) => patch({ tags: event.target.value })}
              placeholder="leaks, trailer, hardware"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="admin-scene">
                Cover scene
              </label>
              <select
                id="admin-scene"
                className={fieldClass}
                value={draft.coverScene}
                onChange={(event) =>
                  patch({ coverScene: event.target.value as CoverScene })
                }
              >
                {COVER_SCENES.map((scene) => (
                  <option key={scene} value={scene}>
                    {scene}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="admin-accent">
                Cover accent
              </label>
              <select
                id="admin-accent"
                className={fieldClass}
                value={draft.coverAccent}
                onChange={(event) =>
                  patch({ coverAccent: event.target.value as CoverAccent })
                }
              >
                {ACCENTS.map((accent) => (
                  <option key={accent} value={accent}>
                    {accent}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold text-white">
            <input
              type="checkbox"
              className="size-4 accent-teal"
              checked={draft.featured}
              onChange={(event) => patch({ featured: event.target.checked })}
            />
            Feature on the homepage
          </label>
        </div>
      </details>

      {error ? (
        <p className="text-sm font-semibold text-magenta" role="alert">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-4 z-10 flex flex-wrap gap-3 rounded-2xl bg-ink/95 py-3">
        <button
          type="submit"
          className={outlinePillClass("px-5")}
          disabled={busy}
        >
          {saving === "draft" ? "Saving…" : "Save draft"}
        </button>
        <button
          type="button"
          className={ctaPillClass("white")}
          disabled={busy}
          onClick={() => void onSave(true)}
        >
          {saving === "publish" ? "Publishing…" : "Publish"}
        </button>
        <Link href="/admin/" className={outlinePillClass("px-5")}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
