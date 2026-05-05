import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { CALCULATORS } from "@/lib/calculators";

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: ArticleStatus;
  related_calculators: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: ArticleStatus;
  related_calculators: string[] | null;
  published_at: string | null;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export async function getPublishedArticles() {
  const supabase = createServerClient() as any;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading articles", error.message);
    return [] as Article[];
  }

  return (data ?? []) as Article[];
}

export async function getPublishedArticleBySlug(slug: string) {
  const supabase = createServerClient() as any;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error loading article", error.message);
    return null;
  }

  return data as Article | null;
}

export async function listAdminArticles() {
  const supabase = createBrowserClient() as any;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function getAdminArticle(id: string) {
  const supabase = createBrowserClient() as any;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Article | null;
}

export async function createArticle(input: ArticleInput) {
  const supabase = createBrowserClient() as any;
  const { data, error } = await supabase
    .from("articles")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return data as Article;
}

export async function updateArticle(id: string, input: ArticleInput) {
  const supabase = createBrowserClient() as any;
  const { data, error } = await supabase
    .from("articles")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data as Article;
}

export async function deleteArticle(id: string) {
  const supabase = createBrowserClient() as any;
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadArticleImage(file: File) {
  const supabase = createBrowserClient() as any;
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from("article-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("article-images").getPublicUrl(path);
  return data.publicUrl as string;
}


export type LinkSuggestion = {
  title: string;
  href: string;
  reason: string;
  score: number;
};

function countMatches(text: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.match(new RegExp(`\\b${escaped}\\b`, "gi"));
    return score + (matches?.length ?? 0);
  }, 0);
}

export async function suggestInternalLinks(article: Pick<Article, "id" | "title" | "content" | "slug">) {
  const text = `${article.title} ${article.content}`.toLowerCase();
  const suggestions: LinkSuggestion[] = [];

  for (const calculator of CALCULATORS) {
    const score = countMatches(text, calculator.keywords);
    if (score > 0) {
      suggestions.push({
        title: calculator.title,
        href: calculator.href,
        reason: `Matched calculator terms such as ${calculator.keywords.slice(0, 3).join(", ")}.`,
        score: score + 4,
      });
    }
  }

  const articles = await listAdminArticles();
  for (const existing of articles) {
    if (existing.id === article.id || existing.status !== "published") continue;
    const titleWords = existing.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 4)
      .slice(0, 10);
    const score = countMatches(text, titleWords);
    if (score > 0) {
      suggestions.push({
        title: existing.title,
        href: `/resources/${existing.slug}`,
        reason: `Similar topic based on title keywords.`,
        score,
      });
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
}
