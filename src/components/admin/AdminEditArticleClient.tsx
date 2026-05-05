"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { getAdminArticle } from "@/lib/articles";
import type { Article } from "@/lib/articles";

export default function AdminEditArticleClient() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    getAdminArticle(id)
      .then((data) => setArticle(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load article"))
      .finally(() => setLoading(false));
  }, [params?.id]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <AdminGuard>
          <div className="mb-6">
            <Link href="/admin/articles" className="text-sm font-semibold text-blue-600 hover:text-blue-800">← Back to articles</Link>
            <h1 className="mt-3 text-3xl font-bold text-[#1e3a5f]">Edit article</h1>
          </div>
          {loading ? <p className="text-sm text-gray-500">Loading article...</p> : error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : <ArticleEditor article={article} />}
        </AdminGuard>
      </div>
    </main>
  );
}
