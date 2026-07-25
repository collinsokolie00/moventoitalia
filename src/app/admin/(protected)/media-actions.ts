"use server";

import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { uploadCmsImage } from "@/lib/firebase/admin-storage";

export type UploadImageState =
  | { success: true; url: string; path: string }
  | { success: false; message: string };

export async function uploadAdminImage(
  formData: FormData,
): Promise<UploadImageState> {
  await requireAdmin();
  const folder = z
    .enum([
      "homepage/banner",
      "services/hero",
      "services/banner",
      "service-areas/hero",
      "blog/featured",
    ])
    .parse(formData.get("folder"));
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { success: false, message: "Choose an image to upload." };
  }

  try {
    const image = await uploadCmsImage(file, folder);
    return { success: true, ...image };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "The image could not be uploaded.",
    };
  }
}
