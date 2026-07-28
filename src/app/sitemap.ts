import type { MetadataRoute } from "next";
import { listPublishedBlogArticles } from "@/lib/database/blog";
import { getSiteUrl } from "@/lib/seo";
import { intlLocales, localePath, locales } from "@/lib/i18n/config";

const publicRoutes = ["/", "/services", "/service-areas", "/about", "/faq", "/contact", "/quote", "/blog", "/terms", "/privacy", "/cookies"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getSiteUrl();
  let articles = [] as Awaited<ReturnType<typeof listPublishedBlogArticles>>;
  try {
    articles = await listPublishedBlogArticles();
  } catch {
    console.error("[Movento SEO] Published articles are temporarily unavailable to the sitemap.");
  }
  const seenSlugs = new Set<string>();
  articles = articles.filter((article) => {
    if (!slugPattern.test(article.slug) || seenSlugs.has(article.slug)) return false;
    seenSlugs.add(article.slug);
    return true;
  });
  const routes = [...publicRoutes, ...articles.map(article => `/blog/${article.slug}`)];
  return routes.flatMap(route => {
    const article = route.startsWith("/blog/")
      ? articles.find((item) => `/blog/${item.slug}` === route)
      : undefined;
    const languages = Object.fromEntries(locales.map(locale => [
      intlLocales[locale],
      new URL(localePath(locale, route), baseUrl).toString(),
    ]));
    languages["x-default"] = new URL(localePath("en", route), baseUrl).toString();
    return locales.map(locale => ({
      url: new URL(localePath(locale, route), baseUrl).toString(),
      lastModified: article?.updatedAt ?? (article?.publishDate ? `${article.publishDate}T00:00:00.000Z` : undefined),
      changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
      priority: route === "/" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
