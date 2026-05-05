export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedArticleBySlug } from "@/lib/articles";
import { markdownToHtml } from "@/lib/markdown";
import { getCalculatorsByKeys } from "@/lib/calculators";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.meta_title || `${article.title} | iBudget`,
    description: article.meta_description || article.excerpt || undefined,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || undefined,
      images: article.featured_image_url ? [article.featured_image_url] : undefined,
      type: "article",
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const html = markdownToHtml(article.content);
  const relatedCalculators = getCalculatorsByKeys(article.related_calculators);

  return (
    <main className="min-h-screen bg-gray-50">
      <article>
        <section className="bg-gradient-to-br from-[#0f1f35] via-[#1e3a5f] to-[#2563eb] px-4 py-14 text-white sm:py-16">
          <div className="mx-auto max-w-4xl">
            <a
              href="/resources"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to resources
            </a>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            {article.excerpt ? (
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-blue-100">
                {article.excerpt}
              </p>
            ) : null}
          </div>
        </section>

        <section className="px-4 py-12 sm:py-14">
          <div className="mx-auto max-w-4xl">
            {article.featured_image_url ? (
              <img
                src={article.featured_image_url}
                alt=""
                className="mb-8 aspect-video w-full rounded-2xl border border-gray-100 object-cover shadow-sm"
              />
            ) : null}
            <div
              className="prose-article rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {relatedCalculators.length > 0 ? (
              <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Related Calculators</p>
                <h2 className="mt-2 text-2xl font-bold text-[#1e3a5f]">Run the numbers for your situation</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {relatedCalculators.map((calculator) => (
                    <a
                      key={calculator.key}
                      href={calculator.href}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      <p className="font-semibold text-gray-900">{calculator.cta}</p>
                      <p className="mt-1 text-sm text-gray-600">Open the {calculator.title.toLowerCase()} and test the figures yourself.</p>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </article>
    </main>
  );
}
