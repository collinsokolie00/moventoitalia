"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/database/firebase-admin";
import { SETTINGS_COLLECTION, SETTINGS_DOCUMENT } from "@/lib/database/settings";
import { settingsSchema } from "@/lib/validation/settings";

export type SettingsActionState = { status: "success" | "error"; message: string } | undefined;

export async function saveSettings(_state: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse({
    ...Object.fromEntries([...settingsSchema.keyof().options]
      .filter((key) => key !== "maintenanceModeEnabled")
      .map((key) => [key, formData.get(key) ?? ""])),
    maintenanceModeEnabled: formData.get("maintenanceModeEnabled") === "on",
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the settings fields." };

  await adminDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOCUMENT).set({
    ...parsed.data,
    updatedAt: FieldValue.serverTimestamp(),
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { status: "success", message: "Settings saved." };
}
