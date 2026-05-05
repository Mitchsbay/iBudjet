import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import ArticleEditor from "@/components/admin/ArticleEditor";

export const dynamic = "force-dynamic";

export default function NewArticlePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <AdminGuard>
          <div className="mb-6">
            <Link href="/admin/articles" className="text-sm font-semibold text-blue-600 hover:text-blue-800">← Back to articles</Link>
            <h1 className="mt-3 text-3xl font-bold text-[#1e3a5f]">Add article</h1>
          </div>
          <ArticleEditor />
        </AdminGuard>
      </div>
    </main>
  );
}
