"use client";

import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";

import { uploadAdminImage } from "@/app/admin/(protected)/media-actions";

export type UploadFolder =
  | "homepage/banner"
  | "services/hero"
  | "services/banner"
  | "service-areas/hero"
  | "blog/featured";

export default function AdminImageUploadField({
  label,
  folder,
  urlName,
  pathName,
  initialUrl = "",
  initialPath = "",
  onChange,
}: {
  label: string;
  folder: UploadFolder;
  urlName: string;
  pathName: string;
  initialUrl?: string;
  initialPath?: string;
  onChange?: (image: { url: string; path: string }) => void;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [path, setPath] = useState(initialPath);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function choose(file: File | undefined) {
    if (!file) return;
    setError("");
    const data = new FormData();
    data.set("folder", folder);
    data.set("file", file);
    startTransition(async () => {
      const result = await uploadAdminImage(data);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setUrl(result.url);
      setPath(result.path);
      onChange?.({ url: result.url, path: result.path });
    });
  }

  function remove() {
    if (!window.confirm("Remove this image? The change is applied when you save.")) {
      return;
    }
    setUrl("");
    setPath("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onChange?.({ url: "", path: "" });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name={urlName} value={url} />
      <input type="hidden" name={pathName} value={path} />
      <p className="text-sm font-bold text-slate-700">{label}</p>
      <div className="mt-3 aspect-[16/7] overflow-hidden rounded-xl border border-slate-200 bg-white">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- Admin preview supports Firebase and legacy CMS URLs.
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-slate-400">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>
      <label className="mt-3 block">
        <span className="text-xs font-bold text-slate-600">
          Image URL (filled automatically after upload)
        </span>
        <input
          type="url"
          value={url}
          placeholder="https://…"
          onChange={(event) => {
            setUrl(event.target.value);
            setPath("");
            onChange?.({ url: event.target.value, path: "" });
          }}
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {url ? "Replace image" : "Upload image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={pending}
            onChange={(event) => choose(event.target.files?.[0])}
            className="sr-only"
          />
        </label>
        {url && (
          <button
            type="button"
            onClick={remove}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-sm font-bold text-red-700">{error}</p>}
    </div>
  );
}
