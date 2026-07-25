import Image from "next/image";

import type { SiteChrome } from "@/lib/database/site-chrome";
import type { SiteSettings } from "@/lib/database/settings";
import type { Locale } from "@/lib/i18n/config";

const labels:Record<Locale,{eyebrow:string;title:string}>={it:{eyebrow:"Manutenzione del sito",title:"Torneremo presto."},en:{eyebrow:"Website maintenance",title:"We’ll be back shortly."}};
export default function MaintenancePage({ settings, chrome, locale }: { settings: SiteSettings; chrome: SiteChrome | null; locale:Locale }) {
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 px-5 py-16 text-white">
    <div className="absolute -left-32 top-12 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
    <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-300/15 blur-3xl" />
    <div className="relative mx-auto max-w-3xl text-center">
      {chrome?.companyLogo ? <Image src={chrome.companyLogo} alt={chrome.companyName} width={1716} height={889} priority className="mx-auto h-auto w-64 brightness-0 invert sm:w-80" /> : <p className="text-3xl font-black tracking-tight">{settings.publicTradingName}</p>}
      <p className="mt-10 text-sm font-bold uppercase tracking-[0.24em] text-blue-200">{labels[locale].eyebrow}</p>
      <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">{labels[locale].title}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">{locale==="it"&&settings.maintenanceMessageIt.trim()?settings.maintenanceMessageIt:settings.maintenanceMessage}</p>
    </div>
  </main>;
}
