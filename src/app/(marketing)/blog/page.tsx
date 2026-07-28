import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

import { listPublishedBlogArticles } from "@/lib/database/blog";
import { getRequestLocale } from "@/lib/i18n/server";
import { intlLocales, localePath } from "@/lib/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { text } from "@/lib/i18n/text";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export async function generateMetadata() {
  const locale=await getRequestLocale();
  return createPageMetadata({
    path: "/blog",
    title: text(locale,"Moving Advice & Guides | Movento Blog","Consigli e guide per il trasloco | Blog Movento"),
    description: text(locale,"Practical moving advice, packing guides, relocation checklists and local information for customers in Terni, Perugia, Rome and nearby areas.","Consigli pratici, guide all’imballaggio e informazioni locali per traslochi a Terni, Perugia, Roma e dintorni."),
  });
}

export const dynamic = "force-dynamic";

function formatDate(value: string, locale:string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const articles = await listPublishedBlogArticles(locale);
  return <>
    <BreadcrumbJsonLd locale={locale} items={[
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]} />
    <section className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">{text(locale, "Movento Blog", "Blog Movento")}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">{text(locale, "Practical advice for a safer and easier move.", "Consigli pratici per un trasloco più semplice e sicuro.")}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-blue-100">{text(locale, "Moving guides, packing advice, pricing explanations and local relocation information for customers across Central Italy.", "Guide al trasloco, consigli per l’imballaggio, spiegazioni sui prezzi e informazioni locali per il Centro Italia.")}</p>
      </div>
    </section>
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {articles.map((article) => <article key={article.id} className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:rounded-4xl">
            {article.featuredImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- CMS images may use any validated HTTPS host.
              <img src={article.featuredImageUrl} alt={article.featuredImageAlt} loading="lazy" decoding="async" className="aspect-[16/9] w-full bg-slate-100 object-cover" />
            )}
            <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-6 lg:p-7">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-3"><p className="min-w-0 text-[9px] font-bold uppercase leading-4 tracking-wide text-blue-700 sm:text-sm sm:tracking-wider">{article.category}</p>{article.featured && <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-black text-amber-800 sm:px-3 sm:text-xs">{text(locale, "Featured", "In evidenza")}</span>}</div>
              <h2 className="mt-2 text-sm font-extrabold leading-5 text-slate-950 sm:mt-4 sm:text-xl sm:leading-tight lg:text-2xl">{article.title}</h2>
              <p className="mt-2 flex-1 text-[11px] leading-4 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">{article.excerpt}</p>
              <div className="mt-4 flex flex-col gap-1.5 text-[9px] leading-4 text-slate-500 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-4 sm:text-sm"><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />{formatDate(article.publishDate,intlLocales[locale])}</span><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />{article.readingTime} {text(locale, "min read", "min di lettura")}</span></div>
              <Link href={localePath(locale,`/blog/${article.slug}`)} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-700 sm:mt-7 sm:gap-2 sm:text-base">{text(locale, "Read article", "Leggi l’articolo")} <ArrowRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" /></Link>
            </div>
          </article>)}
        </div>
        {articles.length === 0 && <div className="rounded-4xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h2 className="text-2xl font-extrabold text-slate-950">{text(locale, "No articles are published yet.", "Non ci sono ancora articoli pubblicati.")}</h2><p className="mt-3 text-slate-600">{text(locale, "Please check back soon for practical moving advice from Movento.", "Torna presto per leggere i consigli pratici di Movento sul trasloco.")}</p></div>}
      </div>
    </section>
  </>;
}
