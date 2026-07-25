"use client";

import { useActionState } from "react";
import { Eye, EyeOff, Save, Trash2 } from "lucide-react";

import { deleteBlogArticle, saveBlogArticle } from "@/app/admin/(protected)/blog/actions";
import type { BlogArticle } from "@/lib/database/blog";
import AdminImageUploadField from "@/components/admin/AdminImageUploadField";

const input = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export default function BlogEditorForm({ article, categories, defaultPublishDate }: { article?: BlogArticle; categories: string[]; defaultPublishDate: string }) {
  const [state, action, pending] = useActionState(saveBlogArticle, undefined);

  return <form action={action} className="grid gap-5 sm:grid-cols-2">
    <input type="hidden" name="id" value={article?.id ?? ""} />
    <input type="hidden" name="currentPublished" value={String(article?.published ?? false)} />
    <Field name="title" label="Title — English" value={article?.title} maxLength={180} />
    <Field name="titleIt" label="Titolo — Italiano" value={article?.titleIt} maxLength={180} required={false} />
    <Field name="slug" label="Slug" value={article?.slug} maxLength={120} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
    <label className="sm:col-span-2">
      <span className="text-sm font-bold text-slate-700">Short excerpt — English</span>
      <textarea name="excerpt" defaultValue={article?.excerpt ?? ""} rows={3} required maxLength={400} className={`${input} resize-y`} />
    </label>
    <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Estratto breve — Italiano</span><textarea name="excerptIt" defaultValue={article?.excerptIt ?? ""} rows={3} maxLength={400} className={`${input} resize-y`} /></label>
    <label className="sm:col-span-2">
      <span className="text-sm font-bold text-slate-700">Article content — English</span>
      <span className="mt-1 block text-xs leading-5 text-slate-500">Markdown: ## heading, **bold**, *italic*, - list, [link](https://…), ![alt](https://…), and &gt; quote.</span>
      <textarea name="content" defaultValue={article?.content ?? ""} rows={18} required className={`${input} resize-y font-mono text-sm leading-6`} />
    </label>
    <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Contenuto articolo — Italiano</span><span className="mt-1 block text-xs leading-5 text-slate-500">Lascia vuoto per mostrare l’articolo inglese completo come fallback.</span><textarea name="contentIt" defaultValue={article?.contentIt ?? ""} rows={18} className={`${input} resize-y font-mono text-sm leading-6`} /></label>
    <div className="sm:col-span-2"><AdminImageUploadField label="Featured image" folder="blog/featured" urlName="featuredImageUrl" pathName="featuredImagePath" initialUrl={article?.featuredImageUrl} initialPath={article?.featuredImagePath} /></div>
    <Field name="featuredImageAlt" label="Featured image alt text" value={article?.featuredImageAlt} maxLength={180} required={false} />
    <Field name="featuredImageAltIt" label="Testo alternativo immagine — Italiano" value={article?.featuredImageAltIt} maxLength={180} required={false} />
    <label>
      <span className="text-sm font-bold text-slate-700">Category</span>
      <input name="category" defaultValue={article?.category ?? ""} list="blog-categories" required className={input} />
      <datalist id="blog-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist>
    </label>
    <Field name="categoryIt" label="Categoria — Italiano" value={article?.categoryIt} maxLength={100} required={false} />
    <Field name="authorName" label="Author name" value={article?.authorName ?? "Movento"} maxLength={100} />
    <Field name="publishDate" label="Publish date" value={article?.publishDate ?? defaultPublishDate} type="date" />
    <Field name="readingTime" label="Reading time (minutes)" value={String(article?.readingTime ?? 5)} type="number" min="1" max="180" />
    <Field name="displayOrder" label="Display order" value={String(article?.displayOrder ?? 0)} type="number" min="0" max="10000" />
    <label className="flex items-center gap-3 self-end rounded-xl bg-slate-50 px-4 py-3 font-bold text-slate-800">
      <input type="checkbox" name="featured" defaultChecked={article?.featured} className="h-5 w-5" />Featured article
    </label>
    <Field name="seoTitle" label="SEO title" value={article?.seoTitle} maxLength={70} />
    <Field name="seoTitleIt" label="Titolo SEO — Italiano" value={article?.seoTitleIt} maxLength={70} required={false} />
    <Field name="openGraphImageUrl" label="Open Graph image URL (optional)" value={article?.openGraphImageUrl} type="url" required={false} />
    <label className="sm:col-span-2">
      <span className="text-sm font-bold text-slate-700">SEO description</span>
      <textarea name="seoDescription" defaultValue={article?.seoDescription ?? ""} rows={3} required minLength={20} maxLength={180} className={`${input} resize-y`} />
    </label>
    <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Descrizione SEO — Italiano</span><textarea name="seoDescriptionIt" defaultValue={article?.seoDescriptionIt ?? ""} rows={3} maxLength={180} className={`${input} resize-y`} /></label>
    <div className="flex flex-wrap justify-end gap-3 sm:col-span-2">
      {article && <button formAction={deleteBlogArticle} formNoValidate onClick={event => { if (!window.confirm("Delete this article permanently?")) event.preventDefault(); }} className="mr-auto inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" />Delete</button>}
      {article && <button name="intent" value="save" disabled={pending} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-5 py-3 font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-60"><Save className="h-4 w-4" />Save changes</button>}
      {article?.published && <button name="intent" value="unpublish" disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-60"><EyeOff className="h-4 w-4" />Unpublish</button>}
      {!article?.published && <button name="intent" value="draft" disabled={pending} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"><Save className="h-4 w-4" />{article ? "Save draft" : "Create draft"}</button>}
      {!article?.published && <button name="intent" value="publish" disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"><Eye className="h-4 w-4" />{article ? "Publish" : "Create & publish"}</button>}
    </div>
    {state && <p aria-live="polite" className={`sm:col-span-2 text-sm font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}
  </form>;
}

function Field({ name, label, value, required = true, ...props }: { name: string; label: string; value?: string; required?: boolean; type?: string; min?: string; max?: string; maxLength?: number; pattern?: string }) {
  return <label><span className="text-sm font-bold text-slate-700">{label}</span><input name={name} defaultValue={value ?? ""} required={required} className={input} {...props} /></label>;
}
