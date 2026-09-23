"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminFormatBar, type FormatAction } from "@/components/AdminFormatBar";
import { ArticleBody } from "@/components/ArticleBody";
import { CoverArt } from "@/components/CoverArt";
import { ctaPillClass, outlinePillClass } from "@/components/pills";
import { describeAdminError } from "@/lib/admin-errors";
import { formatReadTime, readingTimeFromMarkdown, slugify } from "@/lib/format";
import { insertBlock, prefixSelectedLines, wrapFence, wrapSelection } from "@/lib/markdown-insert";
import {
  forgetCreatedStory,
  rememberCreatedStory,
  wasCreatedThisSession,
} from "@/lib/admin-created";
import {
  categoryToAccent,
  categoryToSection,
  deleteArticle,
  emptyDraft,
  fetchAdminArticle,
  rowToDraft,
  saveArticle,
  uploadBodyImage,
  uploadCoverImage,
  type ArticleDraft,
} from "@/lib/remote-articles";
import { getSupabase } from "@/lib/supabase";
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
  preview?: boolean;
};

type Notice = {
  kind: "draft" | "published";
  slug: string;
  title: string;
  id: string;
  created: boolean;
};

type FieldSnapshot = {
  title: string;
  excerpt: string;
  content: string;
};

const HISTORY_LIMIT = 30;
const COALESCE_MS = 400;

type SaveState = "saved" | "saving" | "unsaved" | "idle";

function liveReadMinutes(markdown: string): number {
  const { wordCount, readingTimeMinutes } = readingTimeFromMarkdown(markdown);
  return wordCount ? readingTimeMinutes : 0;
}

export function AdminEditor({ slug, preview = false }: AdminEditorProps) {
  const router = useRouter();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const bodyImageRef = useRef<HTMLInputElement>(null);
  const draftRef = useRef<ArticleDraft>(emptyDraft());
  const editGen = useRef(0);
  const dragDepth = useRef(0);
  const bodyDragDepth = useRef(0);
  const persistLock = useRef(false);
  const historyRef = useRef<FieldSnapshot[]>([]);
  const futureRef = useRef<FieldSnapshot[]>([]);
  const applyingHistory = useRef(false);
  const lastHistoryAt = useRef(0);
  const undoEditRef = useRef<() => void>(() => {});
  const redoEditRef = useRef<() => void>(() => {});
  const skipLeave = useRef(false);
  const [draft, setDraft] = useState<ArticleDraft>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bodyUploading, setBodyUploading] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [bodyDropActive, setBodyDropActive] = useState(false);
  const [coverPreview, setCoverPreview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [undoingAdd, setUndoingAdd] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useLayoutEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useLayoutEffect(() => {
    undoEditRef.current = undoEdit;
    redoEditRef.current = redoEdit;
  });

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
        const next = rowToDraft(row);
        setDraft(next);
        draftRef.current = next;
        setCoverPreview("");
        setSlugTouched(true);
        setDirty(false);
        setSaveState("saved");
        historyRef.current = [];
        futureRef.current = [];
        setCanUndo(false);
        setCanRedo(false);
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

  function fieldsOf(item: ArticleDraft): FieldSnapshot {
    return { title: item.title, excerpt: item.excerpt, content: item.content };
  }

  function syncHistoryButtons() {
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  }

  function recordHistory() {
    if (applyingHistory.current) return;
    const now = Date.now();
    if (historyRef.current.length && now - lastHistoryAt.current < COALESCE_MS) {
      lastHistoryAt.current = now;
      return;
    }
    const snap = fieldsOf(draftRef.current);
    const last = historyRef.current[historyRef.current.length - 1];
    if (
      last &&
      last.title === snap.title &&
      last.excerpt === snap.excerpt &&
      last.content === snap.content
    ) {
      return;
    }
    historyRef.current = [...historyRef.current, snap].slice(-HISTORY_LIMIT);
    futureRef.current = [];
    lastHistoryAt.current = now;
    syncHistoryButtons();
  }

  function applySnapshot(snap: FieldSnapshot) {
    applyingHistory.current = true;
    setDraft((current) => ({ ...current, ...snap }));
    markDirty();
    requestAnimationFrame(() => {
      applyingHistory.current = false;
    });
  }

  function undoEdit() {
    const prev = historyRef.current[historyRef.current.length - 1];
    if (!prev) return;
    historyRef.current = historyRef.current.slice(0, -1);
    futureRef.current = [...futureRef.current, fieldsOf(draftRef.current)].slice(
      -HISTORY_LIMIT,
    );
    applySnapshot(prev);
    syncHistoryButtons();
  }

  function redoEdit() {
    const next = futureRef.current[futureRef.current.length - 1];
    if (!next) return;
    futureRef.current = futureRef.current.slice(0, -1);
    historyRef.current = [...historyRef.current, fieldsOf(draftRef.current)].slice(
      -HISTORY_LIMIT,
    );
    applySnapshot(next);
    syncHistoryButtons();
  }

  function markDirty() {
    editGen.current += 1;
    setDirty(true);
    setSaveState("unsaved");
  }

  function patch(partial: Partial<ArticleDraft>) {
    recordHistory();
    setDraft((current) => ({ ...current, ...partial }));
    markDirty();
  }

  function onTitle(title: string) {
    recordHistory();
    setDraft((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title),
    }));
    markDirty();
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
    markDirty();
  }

  function applyBody(next: { value: string; caret: { start: number; end: number } }) {
    patch({ content: next.value });
    requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(next.caret.start, next.caret.end);
    });
  }

  function applyFormat(action: FormatAction) {
    if (action === "image") {
      bodyImageRef.current?.click();
      return;
    }
    const field = bodyRef.current;
    const caret = {
      start: field?.selectionStart ?? draft.content.length,
      end: field?.selectionEnd ?? draft.content.length,
    };
    let next = { value: draft.content, caret };
    if (action === "bold") next = wrapSelection(draft.content, caret, "**", "**", "bold");
    if (action === "italic") next = wrapSelection(draft.content, caret, "*", "*", "italic");
    if (action === "link") {
      const href = window.prompt("Link URL", "https://");
      if (!href) return;
      next = wrapSelection(draft.content, caret, "[", `](${href.trim()})`, "link");
    }
    if (action === "heading") next = prefixSelectedLines(draft.content, caret, "## ");
    if (action === "quote" || action === "pullquote") {
      next = prefixSelectedLines(draft.content, caret, "> ");
    }
    if (action === "list") next = prefixSelectedLines(draft.content, caret, "- ");
    if (action === "protip") next = wrapFence(draft.content, caret, "protip", "Pro tip");
    applyBody(next);
  }

  async function onBodyImage(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Image upload failed. Use a JPG, PNG, or WebP image.");
      return;
    }
    setError(null);
    const alt =
      file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Image";
    const localUrl = URL.createObjectURL(file);
    const field = bodyRef.current;
    const caret = {
      start: field?.selectionStart ?? draft.content.length,
      end: field?.selectionEnd ?? draft.content.length,
    };
    const inserted = insertBlock(draft.content, caret, `![${alt}](${localUrl})`);
    applyBody(inserted);
    setBodyUploading(true);
    try {
      const url = await uploadBodyImage(draft.slug || draft.title || "story", file);
      setDraft((current) => ({
        ...current,
        content: current.content.replaceAll(localUrl, url),
      }));
      markDirty();
    } catch (err) {
      setError(describeAdminError(err));
    } finally {
      setBodyUploading(false);
    }
  }

  async function onUpload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Cover upload failed. Use a JPG, PNG, or WebP image.");
      return;
    }
    setError(null);
    const localUrl = URL.createObjectURL(file);
    setCoverPreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return localUrl;
    });
    setUploading(true);
    try {
      const url = await uploadCoverImage(draft.slug || draft.title || "story", file);
      setDraft((current) => ({ ...current, coverImageUrl: url }));
      markDirty();
      setCoverPreview((current) => {
        if (current.startsWith("blob:")) URL.revokeObjectURL(current);
        return "";
      });
    } catch (err) {
      setError(describeAdminError(err));
    } finally {
      setUploading(false);
    }
  }

  const persist = useCallback(async (publish: boolean, silent: boolean) => {
    if (silent && persistLock.current) return null;
    const current = draftRef.current;
    if (!current.title.trim()) {
      if (!silent) setError("Add a title before saving.");
      return null;
    }
    if (publish && !current.authorName.trim()) {
      setError("Add an author name before publishing.");
      return null;
    }
    const next: ArticleDraft = {
      ...current,
      published: publish ? true : Boolean(current.id && current.published && silent),
    };
    if (!publish && !silent) next.published = false;
    if (publish) next.published = true;
    if (!next.sectionManual) next.section = categoryToSection(next.category);
    persistLock.current = true;
    const token = editGen.current;
    const wasNew = !current.id;
    try {
      const result = await saveArticle(next);
      setDraft((existing) => ({
        ...existing,
        ...(token === editGen.current ? next : {}),
        id: result.id,
        slug: result.slug,
      }));
      setSlugTouched(true);
      if (token === editGen.current) {
        setDirty(false);
        setSaveState("saved");
      }
      if (wasNew) {
        rememberCreatedStory({
          id: result.id,
          slug: result.slug,
          title: next.title.trim(),
          at: Date.now(),
        });
      }
      if (!silent) {
        setNotice({
          kind: publish ? "published" : "draft",
          slug: result.slug,
          title: next.title.trim(),
          id: result.id,
          created: wasNew || wasCreatedThisSession(result.id),
        });
        router.replace(`/admin/write/?slug=${encodeURIComponent(result.slug)}`);
      } else if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.get("slug") !== result.slug) {
          url.searchParams.set("slug", result.slug);
          window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
        }
      }
      return result;
    } finally {
      persistLock.current = false;
    }
  }, [router]);

  async function onSave(publish: boolean) {
    setSaving(publish ? "publish" : "draft");
    setError(null);
    setNotice(null);
    try {
      await persist(publish, false);
    } catch (err) {
      const message = describeAdminError(err);
      if (preview && !draftRef.current.id && message === "You are not signed in.") {
        const title = draftRef.current.title.trim() || "Untitled";
        const nextSlug = draftRef.current.slug || slugify(title) || "preview";
        rememberCreatedStory({
          id: "preview-new",
          slug: nextSlug,
          title,
          at: Date.now(),
        });
        setDirty(false);
        setNotice({
          kind: publish ? "published" : "draft",
          slug: nextSlug,
          title,
          id: "preview-new",
          created: true,
        });
      } else {
        setError(message);
      }
    } finally {
      setSaving(null);
    }
  }

  async function undoAdd() {
    if (!notice?.created) return;
    setUndoingAdd(true);
    setError(null);
    try {
      if (notice.id && !notice.id.startsWith("preview")) {
        await deleteArticle(notice.id);
      }
      forgetCreatedStory(notice.id);
      skipLeave.current = true;
      setNotice(null);
      const blank = emptyDraft();
      setDraft(blank);
      draftRef.current = blank;
      historyRef.current = [];
      futureRef.current = [];
      setCanUndo(false);
      setCanRedo(false);
      setDirty(false);
      setSaveState("idle");
      setSlugTouched(false);
      router.replace(preview ? "/admin/write/?preview=layout" : "/admin/write/");
    } catch (err) {
      setError(describeAdminError(err));
    } finally {
      setUndoingAdd(false);
    }
  }

  useEffect(() => {
    if (!dirty || loading) return;
    if (!draft.title.trim()) return;
    const timer = window.setTimeout(() => {
      void (async () => {
        const supabase = getSupabase();
        if (!supabase) return;
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        setSaveState("saving");
        try {
          await persist(false, true);
        } catch (err) {
          const message = describeAdminError(err);
          setSaveState("unsaved");
          if (message !== "You are not signed in.") setError(message);
        }
      })();
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [draft, dirty, loading, persist]);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty || skipLeave.current) return;
      event.preventDefault();
      event.returnValue = "";
    }
    function onClick(event: MouseEvent) {
      if (!dirty || skipLeave.current) return;
      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link || link.target === "_blank") return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const ok = window.confirm(
        "Leave without saving? Your last edits are not saved yet.",
      );
      if (!ok) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-admin-editor]")) return;
      event.preventDefault();
      if (event.shiftKey) redoEditRef.current();
      else undoEditRef.current();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dirty]);

  const busy = Boolean(saving) || uploading || bodyUploading || undoingAdd;
  const desk = CATEGORY_SECTION[draft.category];
  const readMinutes = liveReadMinutes(draft.content);
  const coverSrc = coverPreview || draft.coverImageUrl;

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
      data-admin-dirty={dirty ? "true" : "false"}
      className="space-y-8 pb-36"
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
            {notice.kind === "published" ? "On the wire" : "Article added"}
          </p>
          <p className="font-display mt-2 text-2xl font-extrabold tracking-tight text-white">
            {notice.kind === "published"
              ? `${notice.title} is live.`
              : `${notice.title} is saved as a draft.`}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {notice.created ? (
              <button
                type="button"
                data-admin-undo-add
                className={ctaPillClass("white")}
                disabled={undoingAdd}
                onClick={() => void undoAdd()}
              >
                {undoingAdd ? "Undoing…" : "Undo"}
              </button>
            ) : null}
            {notice.kind === "published" ? (
              <Link
                href={`/posts/${notice.slug}/`}
                className={outlinePillClass("px-5")}
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
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <label className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase" htmlFor="admin-title">
            Title
          </label>
          <p data-admin-read-time className="text-xs font-medium text-white/70">
            {formatReadTime(readMinutes)}
          </p>
          <p data-admin-save-state={saveState} className="text-xs font-medium text-white/70">
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Saved"
                : saveState === "unsaved"
                  ? "Unsaved"
                  : ""}
          </p>
          <p
            data-admin-status={draft.published ? "published" : "draft"}
            className={`inline-flex min-h-8 items-center rounded-full px-3 text-[10px] font-semibold tracking-[0.16em] uppercase ${
              draft.published ? "bg-teal text-ink" : "bg-raised text-white"
            }`}
          >
            {draft.published ? "Published" : "Draft"}
          </p>
        </div>
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
          <div
            data-admin-body-drop
            data-drop-active={bodyDropActive ? "true" : "false"}
            className={`overflow-hidden rounded-xl bg-raised ${
              bodyDropActive ? "ring-2 ring-teal" : ""
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
              setBodyDropActive(true);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              bodyDragDepth.current += 1;
              setBodyDropActive(true);
            }}
            onDragLeave={() => {
              bodyDragDepth.current = Math.max(0, bodyDragDepth.current - 1);
              if (bodyDragDepth.current === 0) setBodyDropActive(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              bodyDragDepth.current = 0;
              setBodyDropActive(false);
              const file = event.dataTransfer.files?.[0];
              if (file?.type.startsWith("image/")) void onBodyImage(file);
            }}
          >
            <div className="px-3 pt-3">
              <AdminFormatBar
                onFormat={applyFormat}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undoEdit}
                onRedo={redoEdit}
              />
            </div>
            <textarea
              id="admin-body"
              ref={bodyRef}
              className="w-full min-h-80 bg-transparent px-4 pb-4 font-mono text-sm text-white placeholder:text-white/40 md:min-h-[28rem]"
              value={draft.content}
              onChange={(event) => patch({ content: event.target.value })}
              placeholder="Write, or drop an image. The preview updates as you type."
            />
            <input
              ref={bodyImageRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={busy}
              onChange={(event) => {
                void onBodyImage(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            {bodyUploading ? (
              <p className="px-4 pb-3 text-xs font-medium text-white/70">Uploading image…</p>
            ) : null}
          </div>
        </div>
        <div>
          <p className={labelClass}>Preview</p>
          <div
            data-admin-preview
            className="min-h-80 rounded-2xl bg-ink px-5 py-6 md:min-h-[28rem]"
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
        <div
          data-admin-cover-drop
          data-admin-cover-has-image={coverSrc ? "true" : "false"}
          data-drop-active={dropActive ? "true" : "false"}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            setDropActive(true);
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            dragDepth.current += 1;
            setDropActive(true);
          }}
          onDragLeave={() => {
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (dragDepth.current === 0) setDropActive(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            dragDepth.current = 0;
            setDropActive(false);
            void onUpload(event.dataTransfer.files?.[0]);
          }}
          className={`overflow-hidden rounded-2xl bg-surface ${
            dropActive ? "ring-2 ring-teal" : ""
          }`}
        >
          <CoverArt
            accent={draft.coverAccent}
            scene={draft.coverScene}
            title={draft.title || "Cover"}
            imageUrl={coverSrc || undefined}
            className="aspect-video"
          />
          <p className="px-5 py-3 text-xs font-medium text-white">
            {uploading
              ? "Uploading…"
              : dropActive
                ? "Drop the image"
                : "Drop an image here, or upload."}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className={ctaPillClass("white", "cursor-pointer")}>
            {uploading ? "Uploading…" : coverSrc ? "Replace image" : "Upload image"}
            <input
              id="admin-cover-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={busy}
              onChange={(event) => void onUpload(event.target.files?.[0])}
            />
          </label>
          {coverSrc ? (
            <button
              type="button"
              className={outlinePillClass("px-5")}
              onClick={() => {
                if (coverPreview.startsWith("blob:")) {
                  URL.revokeObjectURL(coverPreview);
                }
                setCoverPreview("");
                patch({ coverImageUrl: "" });
              }}
            >
              Remove
            </button>
          ) : null}
        </div>
        {error ? (
          <p className="mt-4 mb-20 text-sm font-semibold text-magenta" role="alert">
            {error}
          </p>
        ) : (
          <div className="mb-20" />
        )}
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

      {error && !coverSrc ? (
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
