import "server-only";

import type { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";

import { adminDb } from "./firebase-admin";
import type { Locale } from "@/lib/i18n/config";

export const BLOG_COLLECTION = "blogArticles";

export type BlogArticle = {
  id: string;
  title: string;
  titleIt: string;
  slug: string;
  excerpt: string;
  excerptIt: string;
  content: string;
  contentIt: string;
  featuredImageUrl: string;
  featuredImagePath: string;
  featuredImageAlt: string;
  featuredImageAltIt: string;
  category: string;
  categoryIt: string;
  authorName: string;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  publishDate: string;
  readingTime: number;
  seoTitle: string;
  seoTitleIt: string;
  seoDescription: string;
  seoDescriptionIt: string;
  openGraphImageUrl: string;
  createdAt: string | null;
  updatedAt: string | null;
};

function timestampToISOString(value: unknown): string | null {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as Timestamp).toDate().toISOString();
  }
  return null;
}

function mapArticle(document: QueryDocumentSnapshot<DocumentData>, locale: Locale = "en"): BlogArticle {
  const data = document.data();
  const useItalian=locale==="it"&&String(data.contentIt??"").trim().length>0;
  const pick = (english: unknown, italian: unknown) =>
    String(useItalian && String(italian ?? "").trim() ? italian : english ?? "");
  return {
    id: document.id,
    title: pick(data.title, data.titleIt),
    titleIt: data.titleIt ?? "",
    slug: data.slug ?? "",
    excerpt: pick(data.excerpt, data.excerptIt),
    excerptIt: data.excerptIt ?? "",
    content: pick(data.content, data.contentIt),
    contentIt: data.contentIt ?? "",
    featuredImageUrl: data.featuredImageUrl ?? "",
    featuredImagePath: data.featuredImagePath ?? "",
    featuredImageAlt: pick(data.featuredImageAlt, data.featuredImageAltIt),
    featuredImageAltIt: data.featuredImageAltIt ?? "",
    category: pick(data.category, data.categoryIt),
    categoryIt: data.categoryIt ?? "",
    authorName: data.authorName ?? "",
    published: Boolean(data.published),
    featured: Boolean(data.featured),
    displayOrder: Number(data.displayOrder ?? 0),
    publishDate: data.publishDate ?? "",
    readingTime: Number(data.readingTime ?? 0),
    seoTitle: pick(data.seoTitle, data.seoTitleIt),
    seoTitleIt: data.seoTitleIt ?? "",
    seoDescription: pick(data.seoDescription, data.seoDescriptionIt),
    seoDescriptionIt: data.seoDescriptionIt ?? "",
    openGraphImageUrl: data.openGraphImageUrl ?? "",
    createdAt: timestampToISOString(data.createdAt),
    updatedAt: timestampToISOString(data.updatedAt),
  };
}

function sortArticles(left: BlogArticle, right: BlogArticle) {
  return (
    Number(right.featured) - Number(left.featured) ||
    left.displayOrder - right.displayOrder ||
    right.publishDate.localeCompare(left.publishDate) ||
    left.title.localeCompare(right.title)
  );
}

export async function listBlogArticles(locale: Locale = "en"): Promise<BlogArticle[]> {
  const snapshot = await adminDb.collection(BLOG_COLLECTION).get();
  return snapshot.docs.map(document => mapArticle(document, locale)).sort(sortArticles);
}

export async function listPublishedBlogArticles(locale: Locale = "en"): Promise<BlogArticle[]> {
  return (await listBlogArticles(locale)).filter((article) => article.published);
}

export async function getPublishedBlogArticleBySlug(slug: string, locale: Locale = "en"): Promise<BlogArticle | null> {
  const snapshot = await adminDb
    .collection(BLOG_COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const document = snapshot.docs[0];
  if (!document) return null;
  const article = mapArticle(document, locale);
  return article.published ? article : null;
}
