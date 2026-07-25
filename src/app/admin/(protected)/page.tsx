import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileQuestion,
  House,
  Inbox,
  LayoutDashboard,
  MapPinned,
  MessageSquareQuote,
  PanelsTopLeft,
  Settings,
  Sparkles,
  Star,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { AdminBadge, PublicationBadge, ReadStateBadge, RequestTypeBadge, WorkflowStatusBadge } from "@/components/admin/AdminBadge";
import { getDashboardData, type DashboardActivity, type DashboardMetric } from "@/lib/database/dashboard";

const modules: { title: string; href: string; description: string; icon: LucideIcon }[] = [
  { title: "Dashboard", href: "/admin", description: "Overview and recent activity", icon: LayoutDashboard },
  { title: "Quote Requests", href: "/admin/quotes", description: "Standard and custom requests", icon: MessageSquareQuote },
  { title: "Customer Reviews", href: "/admin/reviews", description: "Testimonials and ratings", icon: Star },
  { title: "Homepage Editor", href: "/admin/homepage", description: "Hero, sections and calls to action", icon: House },
  { title: "Services Editor", href: "/admin/services", description: "Services, ordering and publishing", icon: Wrench },
  { title: "Service Areas Editor", href: "/admin/service-areas", description: "Locations, maps and SEO", icon: MapPinned },
  { title: "Blog Editor", href: "/admin/blog", description: "Articles, drafts and SEO", icon: BookOpen },
  { title: "FAQ Editor", href: "/admin/faq", description: "Questions, categories and order", icon: FileQuestion },
  { title: "Contact Editor", href: "/admin/contact", description: "Contact details and hours", icon: PanelsTopLeft },
  { title: "Header & Footer Editor", href: "/admin/navigation", description: "Navigation, links and social profiles", icon: PanelsTopLeft },
  { title: "Settings", href: "/admin/settings", description: "Company and website configuration", icon: Settings },
];

const activityIcons: Record<DashboardActivity["type"], LucideIcon> = {
  quote: MessageSquareQuote,
  review: Star,
  blog: BookOpen,
  service: Wrench,
  serviceArea: MapPinned,
  faq: CircleHelp,
};

export default async function AdminDashboard() {
  const data = await getDashboardData();
  const formatDate = (value: string) => new Intl.DateTimeFormat(data.locale, { dateStyle: "medium", timeStyle: "short", timeZone: data.timeZone }).format(new Date(value));
  const quoteMetrics = [
    { label: "Total requests", supporting: "All customer requests", value: data.metrics.totalQuotes, href: "/admin/quotes?filter=all", icon: MessageSquareQuote },
    { label: "New requests", supporting: "Workflow status: New", value: data.metrics.newQuotes, href: "/admin/quotes?filter=new", icon: Inbox },
    { label: "Custom requests", supporting: "Custom request type", value: data.metrics.customQuotes, href: "/admin/quotes?filter=custom", icon: Sparkles },
    { label: "Awaiting action", supporting: "New or Contacted", value: data.metrics.awaitingActionQuotes, href: "/admin/quotes", icon: Clock3 },
    { label: "Completed", supporting: "Workflow completed", value: data.metrics.completedQuotes, href: "/admin/quotes?filter=completed", icon: CheckCircle2 },
  ] as const;
  const contentMetrics = [
    ["Published reviews", data.metrics.publishedReviews, "/admin/reviews"],
    ["Unpublished reviews", data.metrics.unpublishedReviews, "/admin/reviews"],
    ["Published services", data.metrics.publishedServices, "/admin/services"],
    ["Published areas", data.metrics.publishedServiceAreas, "/admin/service-areas"],
    ["Published articles", data.metrics.publishedBlogArticles, "/admin/blog?status=published"],
    ["Draft articles", data.metrics.draftBlogArticles, "/admin/blog?status=draft"],
    ["Published FAQs", data.metrics.publishedFAQs, "/admin/faq"],
  ] as const;

  return <main className="mx-auto max-w-7xl px-5 py-6 sm:py-8 lg:px-8 lg:py-10">
    <section className="relative isolate overflow-hidden rounded-3xl bg-blue-900 px-6 py-8 text-white shadow-xl shadow-blue-950/15 sm:px-8 sm:py-9 lg:px-10">
      <div aria-hidden="true" className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-2xl" />
      <div aria-hidden="true" className="absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
      <div className="relative z-10 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100">Command centre</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Good to see you.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">Live operational information and every Movento editor in one protected workspace.</p>
      </div>
    </section>

    {data.errors.length > 0 && <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950"><p className="font-extrabold">Some dashboard data is temporarily unavailable.</p><p className="mt-1">The remaining metrics are still live. Refresh the page after checking Firestore connectivity.</p></div>}

    <section aria-labelledby="quote-metrics" className="mt-10">
      <div className="flex items-end justify-between gap-5"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Quote operations</p><h2 id="quote-metrics" className="mt-2 text-2xl font-extrabold text-slate-950">Request overview</h2></div><Link href="/admin/quotes" className="hidden items-center gap-2 text-sm font-bold text-blue-700 sm:inline-flex">View requests <ArrowRight className="h-4 w-4" /></Link></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{quoteMetrics.map((metric) => <QuoteMetricCard key={metric.label} {...metric} />)}</div>
    </section>

    <section aria-labelledby="quick-actions" className="mt-10">
      <h2 id="quick-actions" className="text-lg font-extrabold text-slate-950">Quick actions</h2>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">{[
        ["View Quote Requests", "/admin/quotes"], ["Manage Blog", "/admin/blog"], ["Manage Reviews", "/admin/reviews"], ["Edit Homepage", "/admin/homepage"], ["Edit Services", "/admin/services"], ["Open Settings", "/admin/settings"],
      ].map(([label, href]) => <Link key={label} href={href} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm hover:border-blue-300 hover:text-blue-700">{label}<ArrowUpRight className="h-4 w-4" /></Link>)}</div>
    </section>

    <section aria-labelledby="content-metrics" className="mt-12">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Publishing</p>
      <h2 id="content-metrics" className="mt-2 text-2xl font-extrabold text-slate-950">Content status</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">{contentMetrics.map(([label, value, href]) => <MetricCard key={label} label={label} value={value} href={href} compact />)}</div>
    </section>

    <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl bg-blue-950 p-6 text-white shadow-sm sm:p-7">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">Quote activity</p>
        <h2 className="mt-2 text-2xl font-extrabold">Recent volume</h2>
        <div className="mt-6 grid grid-cols-3 gap-3">{[["Today", data.quotePeriods.today], ["Last 7 days", data.quotePeriods.sevenDays], ["Last 30 days", data.quotePeriods.thirtyDays]].map(([label, value]) => <div key={label as string} aria-label={`${label}: ${value ?? "unavailable"}`} className="rounded-2xl bg-white/10 p-4"><p className="text-3xl font-black">{displayMetric(value as DashboardMetric)}</p><p className="mt-1 text-xs leading-5 text-blue-200">{label}</p></div>)}</div>
        <p className="mt-5 text-xs leading-5 text-blue-200">Calendar periods use {data.timeZone}.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Newest first</p><h2 className="mt-2 text-2xl font-extrabold text-slate-950">Recent quote requests</h2></div><Link href="/admin/quotes" className="text-sm font-bold text-blue-700">View all</Link></div>
        <div className="mt-5 divide-y divide-slate-100">{data.recentQuotes.map((quote) => <Link href={`/admin/quotes/${quote.id}`} key={quote.id} className="grid gap-3 py-4 transition hover:text-blue-700 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-extrabold text-slate-950">{quote.customerName}</p><p className="mt-1 text-sm text-slate-500">{quote.reference}{quote.route ? ` · ${quote.route}` : ""}</p><div className="mt-2 flex flex-wrap gap-2"><RequestTypeBadge type={quote.requestType} /><ReadStateBadge state={quote.readState} /></div></div><div className="flex flex-wrap items-center gap-3 sm:justify-end"><WorkflowStatusBadge status={quote.status} /><time className="text-xs text-slate-400" dateTime={quote.createdAt}>{formatDate(quote.createdAt)}</time></div></Link>)}{data.recentQuotes.length === 0 && <p className="py-10 text-center text-slate-500">No quote requests have been received yet.</p>}</div>
      </div>
    </section>

    <section aria-labelledby="recent-activity" className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Newest first</p><h2 id="recent-activity" className="mt-2 text-2xl font-extrabold text-slate-950">Recent activity</h2></div>
      <div className="mt-6 grid gap-x-8 lg:grid-cols-2">{data.activities.map((activity) => { const Icon = activityIcons[activity.type]; return <Link key={activity.id} href={activity.href} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 border-b border-slate-100 py-5 outline-none hover:bg-slate-50/70 focus:bg-slate-50/70 focus:ring-4 focus:ring-blue-100"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="text-xs font-black uppercase tracking-wider text-blue-700">{activity.label}</span><span className="mt-1 block truncate font-extrabold text-slate-950">{activity.title}</span><span className="mt-1 block truncate text-sm text-slate-500">{activity.detail}</span><span className="mt-3 flex flex-wrap items-center gap-2"><ActivityBadges activity={activity} /><time className="text-xs text-slate-400" dateTime={activity.occurredAt}>{formatDate(activity.occurredAt)}</time></span></span></Link>; })}{data.activities.length === 0 && <p className="py-10 text-slate-500">No timestamped activity is available yet.</p>}</div>
    </section>

    <section className="mt-12">
      <h2 className="text-2xl font-extrabold text-slate-950">Manage website</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">{modules.map((item) => { const Icon = item.icon; return <Link key={item.title} href={item.href} className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-6"><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700 sm:h-12 sm:w-12"><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></span><ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-blue-700" /></div><h3 className="mt-5 text-base font-extrabold text-slate-950 sm:mt-6 sm:text-xl">{item.title}</h3><p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{item.description}</p></Link>; })}</div>
    </section>
  </main>;
}

function displayMetric(value: DashboardMetric) { return value === null ? "—" : value.toLocaleString(); }

function MetricCard({ label, value, href, compact = false }: { label: string; value: DashboardMetric; href: string; compact?: boolean }) {
  return <Link href={href} aria-label={`${label}: ${value ?? "unavailable"}`} className={`group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md ${compact ? "p-4" : "p-5"}`}><p className="text-xs font-bold leading-5 text-slate-500">{label}</p><div className="mt-2 flex items-end justify-between gap-2"><p className={`${compact ? "text-3xl" : "text-4xl"} font-black text-slate-950`}>{displayMetric(value)}</p><ArrowUpRight className="mb-1 h-4 w-4 text-slate-300 group-hover:text-blue-700" /></div></Link>;
}

function QuoteMetricCard({ label, supporting, value, href, icon: Icon }: { label: string; supporting: string; value: DashboardMetric; href: string; icon: LucideIcon }) {
  return <Link href={href} aria-label={`${label}: ${value ?? "unavailable"}`} className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm outline-none transition hover:border-blue-300 hover:shadow-md focus:ring-4 focus:ring-blue-100"><Icon className="h-5 w-5 text-blue-700" /><p className="mt-4 text-sm font-bold text-slate-800">{label}</p><p className="mt-1 text-4xl font-extrabold text-slate-900">{displayMetric(value)}</p><p className="mt-2 text-xs leading-5 text-slate-500">{supporting}</p></Link>;
}

function ActivityBadges({ activity }: { activity: DashboardActivity }) {
  if (activity.type === "quote" && activity.requestType && activity.workflowStatus) {
    return <><RequestTypeBadge type={activity.requestType} /><WorkflowStatusBadge status={activity.workflowStatus} /></>;
  }
  if (activity.status === "Published") return <PublicationBadge published />;
  if (activity.status === "Draft") return <PublicationBadge published={false} draftLabel="Draft" />;
  if (activity.status === "Unpublished") return <PublicationBadge published={false} />;
  return <AdminBadge>{activity.status}</AdminBadge>;
}
