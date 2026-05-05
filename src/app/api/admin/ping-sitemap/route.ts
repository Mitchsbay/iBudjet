import { NextResponse } from "next/server";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    "https://ibudget.au"
  );
}

export async function POST() {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  try {
    const response = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
      method: "GET",
      cache: "no-store",
    });

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      sitemapUrl,
      message: response.ok
        ? "Sitemap ping sent. You can also submit the sitemap directly inside Google Search Console."
        : "Sitemap was regenerated dynamically, but Google's ping endpoint did not confirm success. Submit the sitemap in Search Console if needed.",
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      sitemapUrl,
      message: "Sitemap is available, but the ping request failed. Submit the sitemap manually in Google Search Console.",
    });
  }
}
