"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { BLOG_COLLECTION } from "@/lib/database/blog";
import { adminDb } from "@/lib/database/firebase-admin";
import { deleteCmsImage } from "@/lib/firebase/admin-storage";

const optionalUrl = z.union([z.literal(""), z.url()]);
const articleSchema = z.object({
  title: z.string().trim().min(3).max(180),
  titleIt: z.string().trim().max(180),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug containing letters, numbers and hyphens only."),
  excerpt: z.string().trim().min(20).max(400),
  excerptIt: z.string().trim().max(400),
  content: z.string().trim().min(100).max(100000),
  contentIt: z.string().trim().max(100000),
  featuredImageUrl: optionalUrl,
  featuredImagePath: z.string().max(500),
  featuredImageAlt: z.string().trim().max(180),
  featuredImageAltIt: z.string().trim().max(180),
  category: z.string().trim().min(2).max(100),
  categoryIt: z.string().trim().max(100),
  authorName: z.string().trim().min(2).max(100),
  featured: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(10000),
  publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid publish date."),
  readingTime: z.coerce.number().int().min(1).max(180),
  seoTitle: z.string().trim().min(3).max(70),
  seoTitleIt: z.string().trim().max(70),
  seoDescription: z.string().trim().min(20).max(180),
  seoDescriptionIt: z.string().trim().max(180),
  openGraphImageUrl: optionalUrl,
});

export type BlogActionState = { status: "success" | "error"; message: string } | undefined;

function refreshBlog(...slugs: string[]) {
  revalidatePath("/blog");
  for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
}

export async function saveBlogArticle(_state: BlogActionState, formData: FormData): Promise<BlogActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const intent = String(formData.get("intent") ?? "save");
  const currentPublished = formData.get("currentPublished") === "true";
  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    titleIt: formData.get("titleIt") ?? "",
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    excerptIt: formData.get("excerptIt") ?? "",
    content: formData.get("content"),
    contentIt: formData.get("contentIt") ?? "",
    featuredImageUrl: formData.get("featuredImageUrl") ?? "",
    featuredImagePath: formData.get("featuredImagePath") ?? "",
    featuredImageAlt: formData.get("featuredImageAlt") ?? "",
    featuredImageAltIt: formData.get("featuredImageAltIt") ?? "",
    category: formData.get("category"),
    categoryIt: formData.get("categoryIt") ?? "",
    authorName: formData.get("authorName"),
    featured: formData.get("featured") === "on",
    displayOrder: formData.get("displayOrder"),
    publishDate: formData.get("publishDate"),
    readingTime: formData.get("readingTime"),
    seoTitle: formData.get("seoTitle"),
    seoTitleIt: formData.get("seoTitleIt") ?? "",
    seoDescription: formData.get("seoDescription"),
    seoDescriptionIt: formData.get("seoDescriptionIt") ?? "",
    openGraphImageUrl: formData.get("openGraphImageUrl") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the article fields." };
  }
  if (parsed.data.featuredImageUrl && !parsed.data.featuredImageAlt) {
    return { status: "error", message: "Add descriptive alt text for the featured image." };
  }

  const collection = adminDb.collection(BLOG_COLLECTION);
  const duplicate = await collection.where("slug", "==", parsed.data.slug).limit(2).get();
  if (duplicate.docs.some((document) => document.id !== id)) {
    return { status: "error", message: "An article with this slug already exists." };
  }

  const existing = id ? await collection.doc(id).get() : null;
  if (id && !existing?.exists) return { status: "error", message: "This article no longer exists." };
  const oldSlug = existing?.data()?.slug ?? "";
  const published = intent === "publish" ? true : intent === "draft" || intent === "unpublish" ? false : currentPublished;
  const reference = id ? collection.doc(id) : collection.doc();
  await reference.set({
    ...parsed.data,
    published,
    updatedAt: FieldValue.serverTimestamp(),
    ...(!id ? { createdAt: FieldValue.serverTimestamp() } : {}),
  }, { merge: true });
  const oldImagePath = existing?.data()?.featuredImagePath ?? "";
  if (oldImagePath && oldImagePath !== parsed.data.featuredImagePath) {
    await deleteCmsImage(oldImagePath);
  }
  refreshBlog(oldSlug, parsed.data.slug);
  return {
    status: "success",
    message: intent === "publish" ? "Article published." : intent === "unpublish" ? "Article unpublished." : published ? "Article updated." : id ? "Draft updated." : "Draft created.",
  };
}

export async function deleteBlogArticle(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).max(100).parse(formData.get("id"));
  const reference = adminDb.collection(BLOG_COLLECTION).doc(id);
  const document = await reference.get();
  const slug = document.data()?.slug ?? "";
  const imagePath = document.data()?.featuredImagePath ?? "";
  await reference.delete();
  if (imagePath) await deleteCmsImage(imagePath);
  refreshBlog(slug);
}
