export const dynamic = "force-dynamic";

import { ArrowRight, BookOpen, Calculator } from "lucide-react";
import { getPublishedArticles } from "@/lib/articles";

export const metadata = {
  title: "Resources & Guides | iBudget",
  description:
    "Helpful Australian finance guides covering home buying, stamp duty, mortgage affordability, and compound interest.",
};

export default async function ResourcesPage() {
  const articles = await getPublishedArticles();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-[#0f1f35] via-[#1e3a5f] to-[#2563eb] px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
            <BookOpen className="h-4 w-4 text-blue-200" />
            Australian finance resources
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Practical guides for smarter money decisions
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-blue-100">
            Helpful Australian guides for home buyers, borrowers, and everyday planners. Start with the guide, then use the calculators to test the numbers for your own situation.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                Popular Guides
              </p>
              <h2 className="text-3xl font-bold text-[#1e3a5f]">Start here</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-500">
              These guides link directly to iBudget calculators so you can move from explanation to numbers without jumping between sites.
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#1e3a5f]">No published guides yet</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Once you publish articles from the admin area, they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <a
                  key={article.id}
                  href={`/resources/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  {article.featured_image_url ? (
                    <img
                      src={article.featured_image_url}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Calculator className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                        Guide
                      </span>
                    </div>
                    <h3 className="text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
                      {article.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
                      {article.excerpt || article.meta_description || "Read this iBudget resource guide."}
                    </p>
                    <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600">
                      Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
