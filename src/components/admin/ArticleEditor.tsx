"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Search } from "lucide-react";
import {
  createArticle,
  slugify,
  suggestInternalLinks,
  updateArticle,
  uploadArticleImage,
} from "@/lib/articles";
import type { Article, ArticleStatus, LinkSuggestion } from "@/lib/articles";
import { CALCULATORS } from "@/lib/calculators";

const emptyContent = `# Article title

Write your introduction here.

## First section

Add your article content here. You can link to calculators like this: [mortgage calculator](/mortgage-calculator).

## Second section

Continue the guide in plain English.`;

function counterClass(value: number, idealMin: number, idealMax: number) {
  if (value === 0) return "text-gray-400";
  if (value < idealMin || value > idealMax) return "text-amber-600";
  return "text-green-700";
}

export default function ArticleEditor({ article }: { article?: Article | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? emptyContent);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featured_image_url ?? "");
  const [metaTitle, setMetaTitle] = useState(article?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(article?.meta_description ?? "");
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? "draft");
  const [relatedCalculators, setRelatedCalculators] = useState<string[]>(article?.related_calculators ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [savedNotice, setSavedNotice] = useState("");
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  const helperSlug = useMemo(() => slugify(title), [title]);
  const previewTitle = (metaTitle || title || "Your article title") + (metaTitle ? "" : " | iBudget");
  const previewDescription = metaDescription || excerpt || "Your meta description or excerpt will appear here. Keep it clear, helpful and specific.";

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadArticleImage(file);
      setFeaturedImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const toggleCalculator = (key: string) => {
    setRelatedCalculators((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const loadSuggestions = async (saved: Article) => {
    setSuggesting(true);
    try {
      setSuggestions(await suggestInternalLinks(saved));
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setSuggesting(false);
    }
  };

  const save = async (nextStatus?: ArticleStatus) => {
    const finalStatus = nextStatus ?? status;
    const finalSlug = slug.trim() || helperSlug;

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!finalSlug) {
      setError("Please enter a slug.");
      return;
    }

    setSaving(true);
    setError("");
    setSavedNotice("");

    try {
      const now = new Date().toISOString();
      const input = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim() || null,
        content,
        featured_image_url: featuredImageUrl.trim() || null,
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
        status: finalStatus,
        related_calculators: relatedCalculators,
        published_at: finalStatus === "published" ? article?.published_at ?? now : null,
      };

      const saved = article?.id
        ? await updateArticle(article.id, input)
        : await createArticle(input);

      setSavedNotice(finalStatus === "published" ? "Article published. Internal link suggestions are below." : "Draft saved. Internal link suggestions are below.");
      await loadSuggestions(saved);

      if (!article?.id) {
        router.push(`/admin/articles/edit/${saved.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {savedNotice && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {savedNotice}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Title</span>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug || slug === helperSlug) setSlug(slugify(e.target.value));
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="First Home Buyer Guide..."
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="first-home-buyer-guide"
          />
          <span className="mt-1 block text-xs text-gray-500">Public URL: /resources/{slug || "your-article-slug"}</span>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Excerpt</span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Short summary for the resources page..."
          />
        </label>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <h2 className="text-base font-bold text-[#1e3a5f]">SEO preview</h2>
          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-green-700">https://ibudget.au/resources/{slug || "your-article-slug"}</p>
            <p className="mt-1 text-lg font-medium leading-snug text-blue-700">{previewTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{previewDescription}</p>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            <p className={counterClass(previewTitle.length, 45, 60)}>
              Title tag: {previewTitle.length} characters. Aim for roughly 45–60.
            </p>
            <p className={counterClass(previewDescription.length, 120, 160)}>
              Meta description: {previewDescription.length} characters. Aim for roughly 120–160.
            </p>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Article content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <span className="mt-2 block text-xs leading-relaxed text-gray-500">
            Use simple Markdown: # main heading, ## section heading, - bullet point, and [link text](/calculator-page).
          </span>
        </label>

        {(suggesting || suggestions.length > 0) && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-bold text-[#1e3a5f]">Internal linking suggestions</h2>
            </div>
            {suggesting ? (
              <p className="mt-3 text-sm text-gray-500">Checking your article for relevant internal links...</p>
            ) : (
              <div className="mt-3 space-y-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.href} className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{suggestion.title}</p>
                        <p className="mt-1 break-all text-xs text-blue-700">{suggestion.href}</p>
                        <p className="mt-1 text-xs text-gray-500">{suggestion.reason}</p>
                      </div>
                      <a href={suggestion.href} target="_blank" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Add it manually using Markdown: [{suggestion.title}]({suggestion.href})</p>
                  </div>
                ))}
                {suggestions.length === 0 && <p className="text-sm text-gray-500">No strong suggestions found yet. Add more article text and save again.</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-[#1e3a5f]">Publish</h2>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-gray-700">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ArticleStatus)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <div className="mt-5 grid grid-cols-1 gap-3">
            <button
              onClick={() => save("draft")}
              disabled={saving}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save draft"}
            </button>
            <button
              onClick={() => save("published")}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-[#1e3a5f]">Featured image</h2>
          {featuredImageUrl ? (
            <img src={featuredImageUrl} alt="Featured" className="mt-4 aspect-video w-full rounded-xl object-cover" />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files?.[0])}
            className="mt-4 block w-full text-sm text-gray-600"
          />
          {uploading && <p className="mt-2 text-sm text-gray-500">Uploading image...</p>}
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-gray-700">Image URL</span>
            <input
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="https://..."
            />
          </label>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-[#1e3a5f]">SEO fields</h2>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-gray-700">Meta title</span>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-gray-700">Meta description</span>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-[#1e3a5f]">Related calculators</h2>
          <p className="mt-1 text-sm text-gray-500">These appear as call-to-action boxes at the bottom of the published guide.</p>
          <div className="mt-4 space-y-2">
            {CALCULATORS.map((calculator) => (
              <label key={calculator.key} className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={relatedCalculators.includes(calculator.key)}
                  onChange={() => toggleCalculator(calculator.key)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-semibold text-gray-800">{calculator.title}</span>
                  <span className="block text-xs text-gray-500">{calculator.href}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
