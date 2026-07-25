import Link from "next/link";

import { FeaturedBadge, PublicationBadge } from "@/components/admin/AdminBadge";
import BlogEditorForm from "@/components/admin/BlogEditorForm";
import { listBlogArticles } from "@/lib/database/blog";

type BlogEditorPageProps = {
  searchParams: Promise<{ query?: string; category?: string; status?: string }>;
};

export default async function BlogEditorPage({ searchParams }: BlogEditorPageProps) {
  const [articles, filters] = await Promise.all([listBlogArticles(), searchParams]);
  const defaultPublishDate = new Date().toISOString().slice(0, 10);
  const query = filters.query?.trim().toLocaleLowerCase() ?? "";
  const category = filters.category ?? "all";
  const status = filters.status ?? "all";
  const categories = [...new Set(articles.map((article) => article.category))].sort();
  const filtered = articles.filter((article) => {
    const matchesQuery = !query || article.title.toLocaleLowerCase().includes(query) || article.category.toLocaleLowerCase().includes(query);
    const matchesCategory = category === "all" || article.category === category;
    const matchesStatus = status === "all" || (status === "published" ? article.published : !article.published);
    return matchesQuery && matchesCategory && matchesStatus;
  });

  return <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
    <Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link>
    <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Blog Editor</h1>
    <p className="mt-3 max-w-2xl leading-7 text-slate-600">Create, order, publish, and edit the articles shown on the Movento Blog.</p>

    <details className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-6" open={articles.length === 0}>
      <summary className="cursor-pointer text-xl font-extrabold text-blue-950">Create an article</summary>
      <div className="mt-6"><BlogEditorForm categories={categories} defaultPublishDate={defaultPublishDate} /></div>
    </details>

    <form className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_220px_180px_auto]">
      <label><span className="sr-only">Search articles</span><input name="query" defaultValue={filters.query ?? ""} placeholder="Search title or category" className="w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
      <label><span className="sr-only">Category</span><select name="category" defaultValue={category} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span className="sr-only">Publishing status</span><select name="status" defaultValue={status} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select></label>
      <button className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Filter</button>
    </form>

    <p className="mt-5 text-sm font-semibold text-slate-500">Showing {filtered.length} of {articles.length} articles</p>
    <div className="mt-4 space-y-4">
      {filtered.map((article) => <details key={article.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4">
          <span><span className="font-extrabold text-slate-950">{article.title}</span><span className="ml-2 text-sm text-slate-400">#{article.displayOrder} · {article.category} · /{article.slug}</span></span>
          <span className="flex flex-wrap gap-2">{article.featured && <FeaturedBadge />}<PublicationBadge published={article.published} draftLabel="Draft" /></span>
        </summary>
        <div className="mt-6 border-t border-slate-100 pt-6"><BlogEditorForm article={article} categories={categories} defaultPublishDate={defaultPublishDate} /></div>
      </details>)}
      {filtered.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">No articles match these filters.</div>}
    </div>
  </main>;
}
