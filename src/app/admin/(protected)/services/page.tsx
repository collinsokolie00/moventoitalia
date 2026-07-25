import Link from "next/link";

import { PublicationBadge } from "@/components/admin/AdminBadge";
import ServiceEditorForm from "@/components/admin/ServiceEditorForm";
import ServiceIcon from "@/components/services/ServiceIcon";
import { listLocalizedServices } from "@/lib/database/services";
import { getSiteMedia } from "@/lib/database/site-media";
import ServicesMediaEditor from "@/components/admin/ServicesMediaEditor";

export default async function ServicesEditorPage() {
  const [services, media] = await Promise.all([listLocalizedServices(), getSiteMedia()]);
  return <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
    <Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link>
    <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Services Editor</h1>
    <p className="mt-3 max-w-2xl leading-7 text-slate-600">Create, order, publish and edit the services shown on the Services page.</p>
    <ServicesMediaEditor media={media} />
    <details className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-6" open={services.length === 0}><summary className="cursor-pointer text-xl font-extrabold text-blue-950">Create a service</summary><div className="mt-6"><ServiceEditorForm /></div></details>
    <div className="mt-8 space-y-4">{services.map(service => <details key={service.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4"><span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><ServiceIcon name={service.icon} className="h-5 w-5" /></span><span><span className="font-extrabold text-slate-950">{service.title.it}</span><span className="ml-2 text-sm text-slate-400">#{service.displayOrder} · /{service.slug}</span></span></span><PublicationBadge published={service.published} /></summary><div className="mt-6 border-t border-slate-100 pt-6"><ServiceEditorForm service={service} /></div></details>)}</div>
  </main>;
}
