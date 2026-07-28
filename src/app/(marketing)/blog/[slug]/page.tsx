import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { cache } from "react";

import BlogArticleContent from "@/components/blog/BlogArticleContent";
import { getPublishedBlogArticleBySlug } from "@/lib/database/blog";
import { absoluteUrl, canonicalPath, createPageMetadata, getSeoSettings, getSiteUrl } from "@/lib/seo";
import { getRequestLocale } from "@/lib/i18n/server";
import { intlLocales, localePath } from "@/lib/i18n/config";
import { text } from "@/lib/i18n/text";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const getArticle = cache(getPublishedBlogArticleBySlug);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
type ArticlePageProps = { params: Promise<{ slug: string }> };

function formatDate(value: string, locale:string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale=await getRequestLocale();
  if (!slugPattern.test(slug)) return { title: text(locale,"Article not found | Movento","Articolo non trovato | Movento"), robots: { index: false, follow: false } };
  const article = await getArticle(slug,locale);
  if (!article) return { title: text(locale,"Article not found | Movento","Articolo non trovato | Movento"), robots: { index: false, follow: false } };
  const metadata = await createPageMetadata({
    path: `/blog/${article.slug}`,
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    image: article.openGraphImageUrl || article.featuredImageUrl,
    imageAlt: article.featuredImageAlt || article.title,
  });
  return {
    ...metadata,
    openGraph: {
      ...(metadata.openGraph ?? {}),
      type: "article",
      publishedTime: `${article.publishDate}T00:00:00.000Z`,
      modifiedTime: article.updatedAt ?? undefined,
      authors: [article.authorName],
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  if (!slugPattern.test(slug)) notFound();
  const locale=await getRequestLocale();
  const [article, settings, baseUrl] = await Promise.all([
    getArticle(slug,locale),
    getSeoSettings(),
    getSiteUrl(),
  ]);
  if (!article) notFound();
  const canonical = new URL(canonicalPath(`/blog/${article.slug}`,locale), baseUrl).toString();
  const image = await absoluteUrl(article.featuredImageUrl || settings?.defaultSeoImageUrl || "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seoDescription,
    image: image ? [image] : undefined,
    datePublished: `${article.publishDate}T00:00:00.000Z`,
    dateModified: article.updatedAt ?? `${article.publishDate}T00:00:00.000Z`,
    author: { "@type": "Person", name: article.authorName },
    publisher: { "@id": new URL("/#organization",baseUrl).toString() },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };
  const safeSchema = JSON.stringify(schema).replace(/</g, "\\u003c");

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeSchema }} />
    <BreadcrumbJsonLd locale={locale} items={[
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: article.title, path: `/blog/${article.slug}` },
    ]} />
    <article className="bg-white text-slate-950">
      <header className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="mx-auto max-w-5xl px-5 py-20 lg:px-8 lg:py-28">
          <Link href={localePath(locale,"/blog")} className="inline-flex items-center gap-2 font-bold text-blue-200 hover:text-white"><ArrowLeft className="h-5 w-5" />{text(locale,"Back to Blog","Torna al Blog")}</Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-blue-200">{article.category}</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{article.title}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-blue-100">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-blue-100"><span>{text(locale,"By","Di")} {article.authorName}</span><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{formatDate(article.publishDate,intlLocales[locale])}</span><span className="flex items-center gap-2"><Clock3 className="h-4 w-4" />{article.readingTime} {text(locale,"min read","min di lettura")}</span></div>
        </div>
      </header>
      {article.featuredImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS images may use any validated HTTPS host.
        <img src={article.featuredImageUrl} alt={article.featuredImageAlt} loading="lazy" decoding="async" className="mx-auto -mb-8 mt-12 aspect-[16/8] w-full max-w-5xl rounded-4xl bg-slate-100 object-cover shadow-xl" />
      )}
      <div className="mx-auto max-w-3xl bg-white px-5 py-20 text-slate-950 lg:px-8"><BlogArticleContent content={article.content} /><div className="mt-14 border-t border-slate-200 pt-8"><Link href={localePath(locale,"/blog")} className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"><ArrowLeft className="h-5 w-5" />{text(locale,"Back to all articles","Torna a tutti gli articoli")}</Link></div></div>
    </article>
  </>;
}
