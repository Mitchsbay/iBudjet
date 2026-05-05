import { getPublishedArticles } from "@/lib/articles";

const staticRoutes = [
  "",
  "/mortgage-calculator",
  "/extra-repayments",
  "/borrowing-power",
  "/stamp-duty",
  "/gst-calculator",
  "/compound-interest",
  "/resources",
];

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    "https://ibudget.au"
  ).replace(/\/$/, "");
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const articles = await getPublishedArticles();
  const now = new Date().toISOString();

  const urls = [
    ...staticRoutes.map((route) => ({
      loc: `${baseUrl}${route}`,
      lastmod: now,
      changefreq: route === "" ? "weekly" : "monthly",
      priority: route === "" ? "1.0" : "0.8",
    })),
    ...articles.map((article) => ({
      loc: `${baseUrl}/resources/${article.slug}`,
      lastmod: article.updated_at || article.published_at || article.created_at || now,
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `  <url>\n    <loc>${escapeXml(url.loc)}</loc>\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`,
    )
    .join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
