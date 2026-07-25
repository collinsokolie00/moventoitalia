import "server-only";
import { revalidatePath } from "next/cache";
import { localePath, locales } from "./config";

export function revalidateLocalizedPath(path:string, type?:"layout"|"page") {
  for (const locale of locales) revalidatePath(localePath(locale,path),type);
  revalidatePath(path,type);
}

export function revalidateLocalizedPaths(paths:string[]) {
  for (const path of new Set(paths)) revalidateLocalizedPath(path);
}
