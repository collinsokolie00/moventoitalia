import Link from "next/link";
import { PublicationBadge } from "@/components/admin/AdminBadge";
import ServiceAreaEditorForm from "@/components/admin/ServiceAreaEditorForm";
import { listServiceAreas } from "@/lib/database/service-areas";
import { getSiteMedia } from "@/lib/database/site-media";
import ServiceAreasHeroEditor from "@/components/admin/ServiceAreasHeroEditor";

export default async function ServiceAreasEditorPage() {
  const [areas, media] = await Promise.all([listServiceAreas(), getSiteMedia()]);
  return <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8"><Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Service Areas Editor</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Manage the locations, coverage, maps and search information shown on the Service Areas page.</p><ServiceAreasHeroEditor image={media.serviceAreasHero} /><details className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-6" open={areas.length === 0}><summary className="cursor-pointer text-xl font-extrabold text-blue-950">Create a service area</summary><div className="mt-6"><ServiceAreaEditorForm /></div></details><div className="mt-8 space-y-4">{areas.map(area => <details key={area.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4"><span><span className="font-extrabold text-slate-950">{area.areaName}</span><span className="ml-2 text-sm text-slate-400">#{area.displayOrder} · /{area.slug}</span></span><PublicationBadge published={area.published} /></summary><div className="mt-6 border-t border-slate-100 pt-6"><ServiceAreaEditorForm area={area} /></div></details>)}</div></main>;
}
