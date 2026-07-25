import "server-only";

import { randomUUID } from "node:crypto";
import { getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function storageBucket() {
  const app = getApps()[0];
  const configured = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const bucketName =
    configured || (projectId ? `${projectId}.firebasestorage.app` : "");

  if (!app || !bucketName) {
    throw new Error("Firebase Storage is not configured.");
  }

  return getStorage(app).bucket(bucketName);
}

export async function uploadCmsImage(file: File, folder: string) {
  const extension = allowedTypes.get(file.type);
  if (!extension) throw new Error("Upload a JPG, PNG, WebP or AVIF image.");
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
    throw new Error("Images must be smaller than 10 MB.");
  }

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+/, "");
  const path = `cms/${safeFolder}/${Date.now()}-${randomUUID()}.${extension}`;
  const token = randomUUID();
  const bucket = storageBucket();
  const object = bucket.file(path);

  await object.save(Buffer.from(await file.arrayBuffer()), {
    resumable: false,
    contentType: file.type,
    metadata: {
      cacheControl: "public,max-age=31536000,immutable",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return {
    path,
    url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`,
  };
}

export async function deleteCmsImage(path: string) {
  if (!path.startsWith("cms/")) return;
  try {
    await storageBucket().file(path).delete({ ignoreNotFound: true });
  } catch (error) {
    console.error("[Movento Storage] Unable to remove replaced image", {
      path,
      code: error instanceof Error ? error.name : "unknown",
    });
  }
}
