"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ctaPillClass, outlinePillClass } from "@/components/pills";
import { CoverArt } from "@/components/CoverArt";
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
import { slugify } from "@/lib/format";
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

export function AdminEditor({ slug }: AdminEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<ArticleDraft>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
        setError(err instanceof Error ? err.message : "Could not load that story.");
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
      section: categoryToSection(category),
      coverAccent: categoryToAccent(category),
    }));
  }

  async function onUpload(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const url = await uploadCoverImage(draft.slug || draft.title || "story", file);
      patch({ coverImageUrl: url });
      setNotice("Cover uploaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover upload failed.");
    }
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const nextSlug = await saveArticle(draft);
      setNotice(draft.published ? "Published to the Newswire." : "Draft saved.");
      router.replace(`/admin/write/?slug=${encodeURIComponent(nextSlug)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed. Check the desk schema.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-white">Loading draft…</p>;
  }

  return (
    <form
      data-admin-editor
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void onSave();
      }}
    >
      <div>
        <label className={labelClass} htmlFor="admin-title">
          Title
        </label>
        <input
          id="admin-title"
          className={fieldClass}
          value={draft.title}
          onChange={(event) => onTitle(event.target.value)}
          required
        />
      </div>
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
      <div>
        <label className={labelClass} htmlFor="admin-excerpt">
          Excerpt
        </label>
        <textarea
          id="admin-excerpt"
          className={`${fieldClass} min-h-24`}
          value={draft.excerpt}
          onChange={(event) => patch({ excerpt: event.target.value })}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="admin-body">
          Body (markdown)
        </label>
        <textarea
          id="admin-body"
          className={`${fieldClass} min-h-72 font-mono text-sm`}
          value={draft.content}
          onChange={(event) => patch({ content: event.target.value })}
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="admin-category">
            Category
          </label>
          <select
            id="admin-category"
            className={fieldClass}
            value={draft.category}
            onChange={(event) => onCategory(event.target.value as Category)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="admin-section">
            Section
          </label>
          <select
            id="admin-section"
            className={fieldClass}
            value={draft.section}
            onChange={(event) => patch({ section: event.target.value as SectionSlug })}
          >
            {SECTION_SLUGS.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="admin-author">
            Author name
          </label>
          <input
            id="admin-author"
            className={fieldClass}
            value={draft.authorName}
            onChange={(event) => patch({ authorName: event.target.value })}
            required
          />
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
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="admin-scene">
            Cover scene
          </label>
          <select
            id="admin-scene"
            className={fieldClass}
            value={draft.coverScene}
            onChange={(event) => patch({ coverScene: event.target.value as CoverScene })}
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
            onChange={(event) => patch({ coverAccent: event.target.value as CoverAccent })}
          >
            {ACCENTS.map((accent) => (
              <option key={accent} value={accent}>
                {accent}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="admin-cover-file">
          Cover image
        </label>
        <input
          id="admin-cover-file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="block w-full text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-teal file:px-4 file:py-2 file:text-sm file:font-bold file:text-ink"
          onChange={(event) => void onUpload(event.target.files?.[0])}
        />
        {draft.coverImageUrl ? (
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-teal"
            onClick={() => patch({ coverImageUrl: "" })}
          >
            Use scene art instead
          </button>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-2xl bg-surface">
        <CoverArt
          accent={draft.coverAccent}
          scene={draft.coverScene}
          title={draft.title || "Cover"}
          imageUrl={draft.coverImageUrl || undefined}
          className="aspect-video"
        />
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
      <label className="flex items-center gap-3 text-sm font-semibold text-white">
        <input
          type="checkbox"
          className="size-4 accent-teal"
          checked={draft.published}
          onChange={(event) => patch({ published: event.target.checked })}
        />
        Publish
      </label>
      {error ? (
        <p className="text-sm font-semibold text-magenta" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="text-sm font-semibold text-teal" role="status">
          {notice}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className={ctaPillClass("white")} disabled={saving}>
          {saving ? "Saving…" : draft.published ? "Save & publish" : "Save draft"}
        </button>
        <Link href="/admin/" className={outlinePillClass("px-5")}>
          Back to desk
        </Link>
      </div>
    </form>
  );
}
