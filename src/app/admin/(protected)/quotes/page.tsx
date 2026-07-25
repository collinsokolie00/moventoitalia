import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { ReadStateBadge, RequestTypeBadge, WorkflowStatusBadge } from "@/components/admin/AdminBadge";
import { listQuotes } from "@/lib/database/quotes";

const filters = [
  ["all", "All"],
  ["standard", "Standard"],
  ["custom", "Custom"],
  ["unread", "Unread"],
  ["read", "Read"],
  ["new", "New"],
  ["contacted", "Contacted"],
  ["quoted", "Quoted"],
  ["completed", "Completed"],
] as const;

type QuoteFilter = (typeof filters)[number][0];

function isQuoteFilter(value?: string): value is QuoteFilter {
  return filters.some(([filter]) => filter === value);
}

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string }> }) {
  const params = await searchParams;
  const active: QuoteFilter = isQuoteFilter(params.filter) ? params.filter : "all";
  const query = params.q?.trim().toLocaleLowerCase() ?? "";
  const quotes = await listQuotes();
  const visible = quotes.filter((quote) => {
    const filterMatches = active === "all"
      || quote.requestType === active
      || quote.readState === active
      || quote.status === active;
    const queryMatches = !query || [
      quote.reference,
      quote.name,
      quote.email,
      quote.phone,
      quote.origin,
      quote.destination,
    ].some((value) => value.toLocaleLowerCase().includes(query));
    return filterMatches && queryMatches;
  });
  const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Quote Requests</h1>
          <p className="mt-3 text-slate-600">Request type, reading state, and workflow status remain separate and persistent.</p>
        </div>
        <form className="relative">
          <input type="hidden" name="filter" value={active} />
          <label htmlFor="quote-search" className="sr-only">Search quote requests</label>
          <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
          <input id="quote-search" name="q" defaultValue={params.q} placeholder="Name, route, email, phone or reference" className="w-full rounded-xl border border-slate-400 bg-white py-3 pl-12 pr-5 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100 sm:w-96" />
        </form>
      </div>

      <nav aria-label="Quote filters" className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {filters.map(([value, label]) => {
          const href = params.q ? `/admin/quotes?filter=${value}&q=${encodeURIComponent(params.q)}` : `/admin/quotes?filter=${value}`;
          return <Link key={value} href={href} aria-current={active === value ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold outline-none transition focus:ring-4 focus:ring-blue-200 ${active === value ? "border-blue-800 bg-blue-800 text-white shadow-sm" : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"}`}>{label}</Link>;
        })}
      </nav>

      <p className="mt-4 text-sm text-slate-500">Showing <span className="font-semibold text-slate-800">{visible.length}</span> of {quotes.length} requests</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {visible.map((quote) => (
            <article
              key={quote.id}
              className="group flex flex-col rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="truncate text-lg font-bold text-slate-900">{quote.name || "Customer"}</p><p className="mt-1 truncate text-xs font-medium text-slate-400">{quote.reference}</p></div>
                <ReadStateBadge state={quote.readState} />
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <p className="font-medium text-slate-700"><span className="break-words">{quote.origin || "—"}</span> <span className="text-slate-400">→</span> <span className="break-words">{quote.destination || "—"}</span></p>
                <time className="block text-slate-500" dateTime={quote.createdAt ?? undefined}>{quote.createdAt ? formatter.format(new Date(quote.createdAt)) : "Date pending"}</time>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
                <RequestTypeBadge type={quote.requestType} /><WorkflowStatusBadge status={quote.status} />
                <Link href={`/admin/quotes/${quote.id}`} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:ml-auto sm:w-auto">Open request <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
          {visible.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center lg:col-span-2"><p className="font-semibold text-slate-700">No quote requests match this view.</p></div>}
      </div>
    </main>
  );
}
