"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import { saveServicesMedia } from "@/app/admin/(protected)/services/actions";
import AdminImageUploadField from "@/components/admin/AdminImageUploadField";
import BannerSlidesEditor from "@/components/admin/BannerSlidesEditor";
import type { SiteMedia } from "@/lib/database/site-media";

export default function ServicesMediaEditor({ media }: { media: SiteMedia }) {
  const [state, action, pending] = useActionState(saveServicesMedia, undefined);
  return (
    <form action={action} className="mt-8 space-y-6 rounded-3xl border border-blue-200 bg-blue-50 p-6">
      <div>
        <h2 className="text-2xl font-extrabold text-blue-950">Services hero and banner</h2>
        <p className="mt-2 text-sm text-blue-800">Upload the hero image and manage the single banner placed after the first two service cards.</p>
      </div>
      <AdminImageUploadField label="Services hero background" folder="services/hero" urlName="servicesHeroUrl" pathName="servicesHeroPath" initialUrl={media.servicesHero.url} initialPath={media.servicesHero.path} />
      <label className="block"><span className="text-sm font-bold">Hero image alt text</span><input name="servicesHeroAlt" defaultValue={media.servicesHero.alt} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
      <label className="block"><span className="text-sm font-bold">Testo alternativo hero — Italiano</span><input name="servicesHeroAltIt" defaultValue={media.servicesHero.altIt} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
      <label className="block"><span className="text-sm font-bold">Mobile focal position</span><select name="servicesHeroPosition" defaultValue={media.servicesHero.position} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option></select></label>
      <div className="border-t border-blue-200 pt-6"><BannerSlidesEditor initialSlides={media.servicesBannerSlides} prefix="servicesBanner" folder="services/banner" /></div>
      <button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{pending ? "Saving…" : "Save Services media"}</button>
      {state && <p className={`text-sm font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}
    </form>
  );
}
