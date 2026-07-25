import { Building2, Truck } from "lucide-react";
import ServiceAreasExplorer from "@/components/service-areas/ServiceAreasExplorer";
import { listPublishedServiceAreas } from "@/lib/database/service-areas";
import { createPageMetadata } from "@/lib/seo";
import { getSiteMedia } from "@/lib/database/site-media";
import { getRequestLocale } from "@/lib/i18n/server";
import { text } from "@/lib/i18n/text";

export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const locale=await getRequestLocale();
  return createPageMetadata({path:"/service-areas",title:text(locale,"Moving Service Areas | Movento","Zone servite per traslochi | Movento"),description:text(locale,"Explore Movento's published moving and relocation service areas across Umbria, Lazio and nearby parts of Central Italy.","Scopri le zone servite da Movento per traslochi e trasferimenti in Umbria, Lazio e nel Centro Italia.")});
}

export default async function ServiceAreasPage() {
  const locale=await getRequestLocale();
  const [areas,media]=await Promise.all([listPublishedServiceAreas(locale),getSiteMedia(locale)]);
  const tr=(en:string,it:string)=>text(locale,en,it);
  const availableServices=locale==="it"
    ?["Traslochi di case e appartamenti","Traslochi di uffici e attività","Ritiro e consegna mobili","Assistenza per imballaggio e disimballaggio","Carico e scarico","Traslochi tra Umbria e Lazio"]
    :["Home and apartment moves","Office and business relocations","Furniture collection and delivery","Packing and unpacking assistance","Loading and unloading","Moves between Umbria and Lazio"];
  return <main className="bg-white text-slate-950">
    <section className={`relative overflow-hidden border-b border-slate-200 ${media.serviceAreasHero.url?"bg-blue-950 text-white":"bg-slate-50"}`} style={media.serviceAreasHero.url?{backgroundImage:`url(${JSON.stringify(media.serviceAreasHero.url)})`,backgroundPosition:media.serviceAreasHero.position,backgroundSize:"cover"}:undefined}>
      {media.serviceAreasHero.url&&<><div className="absolute inset-0 bg-blue-950/75"/><span className="sr-only">{media.serviceAreasHero.alt}</span></>}
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"><div className="max-w-4xl">
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${media.serviceAreasHero.url?"text-blue-200":"text-blue-600"}`}>{tr("Service areas","Zone servite")}</p>
        <h1 className={`mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl ${media.serviceAreasHero.url?"text-white":"text-slate-950"}`}>{tr("Professional moving services across Umbria and beyond","Servizi di trasloco professionali in Umbria e oltre")}</h1>
        <p className={`mt-6 max-w-3xl text-base leading-7 sm:text-lg sm:leading-8 ${media.serviceAreasHero.url?"text-blue-100":"text-slate-600"}`}>{tr("Movento provides moving, transport and relocation services across our published coverage areas.","Movento offre servizi di trasloco, trasporto e trasferimento in tutte le zone di copertura pubblicate.")}</p>
      </div></div>
    </section>
    <ServiceAreasExplorer areas={areas} locale={locale}/>
    <section className="border-y border-slate-200 bg-slate-50"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"><Truck className="h-7 w-7"/></div>
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-blue-600">{tr("Services available","Servizi disponibili")}</p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{tr("Moving support based on your location","Assistenza per il trasloco in base alla località")}</h2>
      <p className="mt-5 max-w-xl leading-7 text-slate-600">{tr("Service availability depends on distance, access, vehicle requirements, moving date and the size of the job.","La disponibilità dipende da distanza, accessi, veicolo necessario, data e dimensioni del trasloco.")}</p>
    </div><div className="grid grid-cols-2 gap-3">{availableServices.map(service=><div key={service} className="flex min-h-28 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><Building2 className="h-5 w-5 text-blue-600"/><p className="mt-5 text-sm font-semibold leading-6 text-slate-900 sm:text-base">{service}</p></div>)}</div></div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-10 lg:p-12"><div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-400">{tr("Outside the listed areas?","Fuori dalle zone elencate?")}</p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{tr("Your location may still be covered","La tua località potrebbe essere comunque coperta")}</h2>
      <p className="mt-5 leading-7 text-slate-300">{tr("The locations shown above are Movento’s principal service areas. Longer-distance and custom relocation requests can still be reviewed individually through the quotation system.","Le località indicate sono le principali zone servite. Le richieste a lunga distanza o personalizzate possono essere valutate singolarmente tramite il sistema di preventivo.")}</p>
    </div></div></section>
  </main>;
}
