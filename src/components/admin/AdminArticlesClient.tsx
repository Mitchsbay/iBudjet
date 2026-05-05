"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import { deleteArticle, listAdminArticles } from "@/lib/articles";
import type { Article } from "@/lib/articles";

function formatDate(value: string | null) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ArticleRow({ article, onDelete }: { article: Article; onDelete: (article: Article) => void }) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-bold text-gray-900">{article.title}</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${article.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {article.status}
          </span>
        </div>
        <p className="mt-1 break-all text-sm text-gray-500">/resources/{article.slug}</p>
        <p className="mt-1 text-xs text-gray-500">
          {article.status === "published" ? `Published ${formatDate(article.published_at)}` : `Last edited ${formatDate(article.updated_at)}`}
        </p>
        {article.excerpt && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Link
          href={`/admin/articles/edit/${article.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Edit className="h-4 w-4" /> Edit
        </Link>
        <button
          onClick={() => onDelete(article)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  );
}

export default function AdminArticlesClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pinging, setPinging] = useState(false);
  const [sitemapNotice, setSitemapNotice] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setArticles(await listAdminArticles());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const publishedArticles = useMemo(
    () => articles.filter((article) => article.status === "published").sort((a, b) => String(b.published_at || b.updated_at).localeCompare(String(a.published_at || a.updated_at))),
    [articles],
  );
  const draftArticles = useMemo(
    () => articles.filter((article) => article.status === "draft").sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))),
    [articles],
  );

  const remove = async (article: Article) => {
    if (!confirm(`Delete "${article.title}"?`)) return;
    try {
      await deleteArticle(article.id);
      setArticles((items) => items.filter((item) => item.id !== article.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete article");
    }
  };

  const pingSitemap = async () => {
    setPinging(true);
    setSitemapNotice("");
    try {
      const response = await fetch("/api/admin/ping-sitemap", { method: "POST" });
      const result = await response.json();
      setSitemapNotice(`${result.message} Sitemap: ${result.sitemapUrl}`);
    } catch (err) {
      setSitemapNotice("Could not ping Google from the dashboard. Your dynamic sitemap is still available at /sitemap.xml.");
    } finally {
      setPinging(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <AdminGuard>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">iBudget CMS</p>
              <h1 className="mt-1 text-3xl font-bold text-[#1e3a5f]">Articles</h1>
              <p className="mt-2 text-sm text-gray-500">Create, edit, publish and plan resource guides without touching code.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={pingSitemap}
                disabled={pinging}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${pinging ? "animate-spin" : ""}`} /> {pinging ? "Submitting..." : "Submit sitemap"}
              </button>
              <Link
                href="/admin/articles/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Add article
              </Link>
            </div>
          </div>

          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {sitemapNotice && <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{sitemapNotice}</div>}

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Published</p>
              <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{publishedArticles.length}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Drafts</p>
              <p className="mt-2 text-3xl font-bold text-[#1e3a5f]">{draftArticles.length}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Sitemap</p>
              <a href="/sitemap.xml" target="_blank" className="mt-2 inline-block break-all text-sm font-semibold text-blue-700 hover:text-blue-900">
                View /sitemap.xml
              </a>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500 shadow-sm">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">No articles yet</h2>
              <p className="mt-1 text-sm text-gray-500">Create your first resource guide to start building the iBudget content library.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-[#1e3a5f]">Content calendar</h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Published articles ordered by publish date.</p>
                </div>
                {publishedArticles.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No published articles yet.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {publishedArticles.map((article) => <ArticleRow key={article.id} article={article} onDelete={remove} />)}
                  </div>
                )}
              </section>

              <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                  <h2 className="text-xl font-bold text-[#1e3a5f]">Drafts</h2>
                  <p className="mt-1 text-sm text-gray-500">Unpublished guides to finish later.</p>
                </div>
                {draftArticles.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No drafts right now.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {draftArticles.map((article) => <ArticleRow key={article.id} article={article} onDelete={remove} />)}
                  </div>
                )}
              </section>
            </div>
          )}
        </AdminGuard>
      </div>
    </main>
  );
}
