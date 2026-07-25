import "server-only";

import type { DocumentData, Query, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { Timestamp as FirestoreTimestamp } from "firebase-admin/firestore";

import type { QuoteStatus } from "./quotes";
import type { QuoteReadState, QuoteRequestType } from "@/lib/quotes/types";
import { adminDb } from "./firebase-admin";
import { getSiteSettings } from "./settings";

export type DashboardMetric = number | null;
export type DashboardActivity = {
  id: string;
  type: "quote" | "review" | "blog" | "service" | "serviceArea" | "faq";
  label: string;
  title: string;
  detail: string;
  status: string;
  occurredAt: string;
  href: string;
  requestType?: QuoteRequestType;
  readState?: QuoteReadState;
  workflowStatus?: QuoteStatus;
};
export type DashboardRecentQuote = {
  id: string;
  reference: string;
  customerName: string;
  route: string;
  requestType: "standard" | "custom";
  readState: QuoteReadState;
  status: QuoteStatus;
  createdAt: string;
};
export type DashboardData = {
  metrics: {
    totalQuotes: DashboardMetric;
    newQuotes: DashboardMetric;
    customQuotes: DashboardMetric;
    awaitingActionQuotes: DashboardMetric;
    completedQuotes: DashboardMetric;
    publishedReviews: DashboardMetric;
    unpublishedReviews: DashboardMetric;
    publishedServices: DashboardMetric;
    publishedServiceAreas: DashboardMetric;
    publishedBlogArticles: DashboardMetric;
    draftBlogArticles: DashboardMetric;
    publishedFAQs: DashboardMetric;
  };
  quotePeriods: { today: DashboardMetric; sevenDays: DashboardMetric; thirtyDays: DashboardMetric };
  recentQuotes: DashboardRecentQuote[];
  activities: DashboardActivity[];
  locale: string;
  timeZone: string;
  errors: string[];
};

function timestampIso(value: unknown) {
  return value && typeof (value as Timestamp).toDate === "function" ? (value as Timestamp).toDate().toISOString() : "";
}

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { year: value("year"), month: value("month"), day: value("day"), hour: value("hour"), minute: value("minute"), second: value("second") };
}

function timeZoneOffset(date: Date, timeZone: string) {
  const parts = zonedParts(date, timeZone);
  const representedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return representedAsUtc - Math.floor(date.getTime() / 1000) * 1000;
}

function startOfZonedDay(now: Date, timeZone: string, daysAgo: number) {
  const local = zonedParts(now, timeZone);
  const target = new Date(Date.UTC(local.year, local.month - 1, local.day - daysAgo));
  const civilMidnight = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
  const firstGuess = new Date(civilMidnight - timeZoneOffset(new Date(civilMidnight), timeZone));
  return new Date(civilMidnight - timeZoneOffset(firstGuess, timeZone));
}

async function count(query: Query<DocumentData>) {
  return (await query.count().get()).data().count;
}

async function safeCount(label: string, query: Query<DocumentData>, errors: string[]) {
  try { return await count(query); }
  catch (error) { console.error(`Dashboard ${label} count failed:`, error); errors.push(label); return null; }
}

async function safeDocuments(label: string, query: Query<DocumentData>, errors: string[]) {
  try { return (await query.get()).docs; }
  catch (error) { console.error(`Dashboard ${label} query failed:`, error); errors.push(label); return []; }
}

type QuoteMetrics = {
  total: number;
  new: number;
  contacted: number;
  quoted: number;
  completed: number;
  custom: number;
  awaitingAction: number;
};

async function safeQuoteMetrics(query: Query<DocumentData>, errors: string[]): Promise<QuoteMetrics | null> {
  try {
    const snapshot = await query.select("requestType", "status").get();
    const metrics: QuoteMetrics = { total: snapshot.size, new: 0, contacted: 0, quoted: 0, completed: 0, custom: 0, awaitingAction: 0 };
    for (const document of snapshot.docs) {
      const data = document.data();
      const status: QuoteStatus = ["new", "contacted", "quoted", "completed"].includes(data.status) ? data.status : "new";
      metrics[status] += 1;
      if (data.requestType === "custom") metrics.custom += 1;
      if (status === "new" || status === "contacted") metrics.awaitingAction += 1;
    }
    return metrics;
  } catch (error) {
    console.error("Dashboard quote metrics query failed:", error);
    errors.push("quote metrics");
    return null;
  }
}

function textValue(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object") {
    const localized = value as Record<string, unknown>;
    for (const locale of ["it", "en", "fr", "de"]) {
      if (typeof localized[locale] === "string" && localized[locale]) return localized[locale] as string;
    }
  }
  return fallback;
}

function activityFromDocument(type: DashboardActivity["type"], document: QueryDocumentSnapshot<DocumentData>): DashboardActivity | null {
  const data = document.data();
  const occurredAt = timestampIso(data.updatedAt ?? data.createdAt);
  if (!occurredAt) return null;
  const createdAt = timestampIso(data.createdAt);
  const created = createdAt && Math.abs(new Date(occurredAt).getTime() - new Date(createdAt).getTime()) < 2000;
  if (type === "review") return { id: `${type}-${document.id}`, type, label: created ? "Review created" : "Review updated", title: textValue(data.customerName, "Customer review"), detail: textValue(data.serviceType || data.city, "Review"), status: data.published ? "Published" : "Unpublished", occurredAt, href: "/admin/reviews" };
  if (type === "blog") return { id: `${type}-${document.id}`, type, label: created ? "Article created" : "Article updated", title: textValue(data.title, "Blog article"), detail: textValue(data.category, "Blog"), status: data.published ? "Published" : "Draft", occurredAt, href: "/admin/blog" };
  if (type === "service") return { id: `${type}-${document.id}`, type, label: created ? "Service created" : "Service updated", title: textValue(data.title, "Service"), detail: textValue(data.subtitle, "Service"), status: data.published ? "Published" : "Unpublished", occurredAt, href: "/admin/services" };
  if (type === "serviceArea") return { id: `${type}-${document.id}`, type, label: created ? "Service area created" : "Service area updated", title: textValue(data.areaName, "Service area"), detail: textValue(data.availabilityNotes, "Service area"), status: data.published ? "Published" : "Unpublished", occurredAt, href: "/admin/service-areas" };
  if (type === "faq") return { id: `${type}-${document.id}`, type, label: created ? "FAQ created" : "FAQ updated", title: textValue(data.question, "FAQ item"), detail: textValue(data.category, "FAQ"), status: data.published ? "Published" : "Unpublished", occurredAt, href: "/admin/faq" };
  return null;
}

function quoteActivityFromDocument(document: QueryDocumentSnapshot<DocumentData>): DashboardActivity | null {
  const data = document.data();
  const requestType: QuoteRequestType = data.requestType === "custom" ? "custom" : "standard";
  const workflowStatus: QuoteStatus = ["new", "contacted", "quoted", "completed"].includes(data.status) ? data.status : "new";
  const events = [
    { label: requestType === "custom" ? "Custom request received" : "Quote request received", timestamp: timestampIso(data.createdAt) },
    { label: "Request marked Contacted", timestamp: timestampIso(data.contactedAt) },
    { label: "Request marked Quoted", timestamp: timestampIso(data.quotedAt) },
    { label: "Request completed", timestamp: timestampIso(data.completedAt) },
  ].filter((event) => event.timestamp).sort((left, right) => right.timestamp.localeCompare(left.timestamp));
  const latestEvent = events[0];
  if (!latestEvent) return null;
  return {
    id: `quote-${document.id}-${latestEvent.timestamp}`,
    type: "quote",
    label: latestEvent.label,
    title: textValue(data.name, "Customer"),
    detail: data.reference ?? document.id,
    status: workflowStatus,
    occurredAt: latestEvent.timestamp,
    href: `/admin/quotes/${document.id}`,
    requestType,
    readState: data.readAt ? "read" : "unread",
    workflowStatus,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const errors: string[] = [];
  let settings = null;
  try { settings = await getSiteSettings(); }
  catch (error) { console.error("Dashboard settings query failed:", error); errors.push("settings"); }
  const locale = settings?.siteLocale ?? "en-IT";
  const timeZone = settings?.defaultTimeZone ?? "Europe/Rome";
  const now = new Date();
  const quotes = adminDb.collection("quotes");
  const reviews = adminDb.collection("reviews");
  const services = adminDb.collection("services");
  const serviceAreas = adminDb.collection("serviceAreas");
  const blog = adminDb.collection("blogArticles");
  const faqs = adminDb.collection("faqs");

  const [
    quoteMetrics,
    todayQuotes, sevenDayQuotes, thirtyDayQuotes,
    totalReviews, publishedReviews, publishedServices, publishedServiceAreas,
    totalBlogArticles, publishedBlogArticles, publishedFAQs,
    recentQuoteDocs, quoteActivityDocs, reviewDocs, blogDocs, serviceDocs, serviceAreaDocs, faqDocs,
  ] = await Promise.all([
    safeQuoteMetrics(quotes, errors),
    safeCount("quotes today", quotes.where("createdAt", ">=", FirestoreTimestamp.fromDate(startOfZonedDay(now, timeZone, 0))), errors),
    safeCount("quotes last 7 days", quotes.where("createdAt", ">=", FirestoreTimestamp.fromDate(startOfZonedDay(now, timeZone, 6))), errors),
    safeCount("quotes last 30 days", quotes.where("createdAt", ">=", FirestoreTimestamp.fromDate(startOfZonedDay(now, timeZone, 29))), errors),
    safeCount("total reviews", reviews, errors),
    safeCount("published reviews", reviews.where("published", "==", true), errors),
    safeCount("published services", services.where("published", "==", true), errors),
    safeCount("published service areas", serviceAreas.where("published", "==", true), errors),
    safeCount("total blog articles", blog, errors),
    safeCount("published blog articles", blog.where("published", "==", true), errors),
    safeCount("published FAQs", faqs.where("published", "==", true), errors),
    safeDocuments("recent quotes", quotes.orderBy("createdAt", "desc").limit(6).select("reference", "name", "origin", "destination", "requestType", "readAt", "status", "createdAt"), errors),
    safeDocuments("quote activity", quotes.orderBy("updatedAt", "desc").limit(12).select("reference", "name", "requestType", "readAt", "status", "createdAt", "contactedAt", "quotedAt", "completedAt", "updatedAt"), errors),
    safeDocuments("recent reviews", reviews.orderBy("updatedAt", "desc").limit(3).select("customerName", "city", "serviceType", "published", "createdAt", "updatedAt"), errors),
    safeDocuments("recent blog", blog.orderBy("updatedAt", "desc").limit(3).select("title", "category", "published", "createdAt", "updatedAt"), errors),
    safeDocuments("recent services", services.orderBy("updatedAt", "desc").limit(2).select("title", "subtitle", "published", "createdAt", "updatedAt"), errors),
    safeDocuments("recent service areas", serviceAreas.orderBy("updatedAt", "desc").limit(2).select("areaName", "availabilityNotes", "published", "createdAt", "updatedAt"), errors),
    safeDocuments("recent FAQs", faqs.orderBy("updatedAt", "desc").limit(2).select("question", "category", "published", "createdAt", "updatedAt"), errors),
  ]);

  const recentQuotes: DashboardRecentQuote[] = recentQuoteDocs.map((document): DashboardRecentQuote => {
    const data = document.data();
    const status = (["new", "contacted", "quoted", "completed"].includes(data.status) ? data.status : "new") as QuoteStatus;
    return { id: document.id, reference: data.reference ?? document.id, customerName: data.name ?? "Customer", route: [data.origin, data.destination].filter(Boolean).join(" → "), requestType: data.requestType === "custom" ? "custom" : "standard", readState: data.readAt ? "read" : "unread", status, createdAt: timestampIso(data.createdAt) };
  }).filter((quote) => quote.createdAt);

  const quoteActivities = quoteActivityDocs.map(quoteActivityFromDocument).filter((activity): activity is DashboardActivity => activity !== null);
  const contentActivities = [
    ...reviewDocs.map((document) => activityFromDocument("review", document)),
    ...blogDocs.map((document) => activityFromDocument("blog", document)),
    ...serviceDocs.map((document) => activityFromDocument("service", document)),
    ...serviceAreaDocs.map((document) => activityFromDocument("serviceArea", document)),
    ...faqDocs.map((document) => activityFromDocument("faq", document)),
  ].filter((activity): activity is DashboardActivity => activity !== null);

  return {
    metrics: {
      totalQuotes: quoteMetrics?.total ?? null,
      newQuotes: quoteMetrics?.new ?? null,
      customQuotes: quoteMetrics?.custom ?? null,
      awaitingActionQuotes: quoteMetrics?.awaitingAction ?? null,
      completedQuotes: quoteMetrics?.completed ?? null,
      publishedReviews,
      unpublishedReviews: totalReviews !== null && publishedReviews !== null ? totalReviews - publishedReviews : null,
      publishedServices,
      publishedServiceAreas,
      publishedBlogArticles,
      draftBlogArticles: totalBlogArticles !== null && publishedBlogArticles !== null ? totalBlogArticles - publishedBlogArticles : null,
      publishedFAQs,
    },
    quotePeriods: { today: todayQuotes, sevenDays: sevenDayQuotes, thirtyDays: thirtyDayQuotes },
    recentQuotes,
    activities: [...quoteActivities, ...contentActivities].sort((left, right) => right.occurredAt.localeCompare(left.occurredAt)).slice(0, 10),
    locale,
    timeZone,
    errors: [...new Set(errors)],
  };
}
