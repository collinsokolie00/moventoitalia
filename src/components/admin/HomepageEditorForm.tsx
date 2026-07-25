"use client";

import { useActionState, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { saveHomepage } from "@/app/admin/(protected)/homepage/actions";
import type { HomepageContent } from "@/lib/database/homepage";
import BannerSlidesEditor from "@/components/admin/BannerSlidesEditor";

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";
const emptyStatistic = { value: "", valueIt: "", label: "", labelIt:"" };

export default function HomepageEditorForm({ content }: { content: HomepageContent | null }) {
  const [state, action, pending] = useActionState(saveHomepage, undefined);
  const [statistics, setStatistics] = useState(content?.statistics.length ? content.statistics : [emptyStatistic]);
  const [benefits, setBenefits] = useState(content?.whyChoose.benefits.length ? content.whyChoose.benefits : [""]);
  const [benefitsIt, setBenefitsIt] = useState(content?.whyChoose.benefitsIt?.length ? content.whyChoose.benefitsIt : [""]);

  return (
    <form action={action} className="mt-8 space-y-7">
      <EditorSection title="Hero" description="The main message and actions shown at the top of the homepage.">
        <TextField name="heroTitle" label="Hero title" value={content?.hero.title} />
        <TextField name="heroTitleIt" label="Titolo hero — Italiano" value={content?.hero.titleIt} required={false}/>
        <TextArea name="heroSubtitle" label="Hero subtitle" value={content?.hero.subtitle} />
        <TextArea name="heroSubtitleIt" label="Sottotitolo hero — Italiano" value={content?.hero.subtitleIt} required={false}/>
        <ButtonFields prefix="heroPrimary" title="Primary button" button={content?.hero.primaryButton} />
        <ButtonFields prefix="heroSecondary" title="Secondary button" button={content?.hero.secondaryButton} />
      </EditorSection>

      <EditorSection title="Statistics" description="Short value and label pairs displayed below the hero buttons.">
        <div className="space-y-4">
          {statistics.map((statistic, index) => (
            <div key={index} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[0.55fr_1fr_auto] sm:items-end">
              <TextField name="statisticValue" label="Value" value={statistic.value} />
              <TextField name="statisticValueIt" label="Valore — Italiano" value={statistic.valueIt} required={false}/>
              <TextField name="statisticLabel" label="Label" value={statistic.label} />
              <TextField name="statisticLabelIt" label="Etichetta — Italiano" value={statistic.labelIt} required={false}/>
              <button type="button" aria-label="Remove statistic" disabled={statistics.length === 1} onClick={() => setStatistics(items => items.filter((_, itemIndex) => itemIndex !== index))} className="grid h-12 w-12 place-items-center rounded-xl border border-red-200 text-red-700 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" disabled={statistics.length >= 6} onClick={() => setStatistics(items => [...items, emptyStatistic])} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700 disabled:opacity-40"><Plus className="h-4 w-4" />Add statistic</button>
      </EditorSection>

      <EditorSection title="Animated promotional banner" description="Add, order, preview and enable the single rotating banner shown on the homepage.">
        <BannerSlidesEditor
          initialSlides={content?.bannerSlides ?? []}
          prefix="homeBanner"
          folder="homepage/banner"
        />
      </EditorSection>

      <EditorSection title="Why Choose Movento" description="The homepage value proposition and ordered benefit list.">
        <TextField name="whyTitle" label="Section title" value={content?.whyChoose.title} />
        <TextField name="whyTitleIt" label="Titolo sezione — Italiano" value={content?.whyChoose.titleIt} required={false}/>
        <TextArea name="whyDescription" label="Description" value={content?.whyChoose.description} />
        <TextArea name="whyDescriptionIt" label="Descrizione — Italiano" value={content?.whyChoose.descriptionIt} required={false}/>
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-700">Benefits</p>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <input name="whyBenefit" defaultValue={benefit} required maxLength={160} className={inputClass.replace("mt-2 ", "")} />
              <button type="button" aria-label="Remove benefit" disabled={benefits.length === 1} onClick={() => setBenefits(items => items.filter((_, itemIndex) => itemIndex !== index))} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-red-200 text-red-700 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" disabled={benefits.length >= 8} onClick={() => setBenefits(items => [...items, ""])} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700 disabled:opacity-40"><Plus className="h-4 w-4" />Add benefit</button>
        <div className="mt-5 space-y-3"><p className="text-sm font-bold text-slate-700">Vantaggi — Italiano</p>{benefitsIt.map((benefit,index)=><div key={index} className="flex items-center gap-3"><input name="whyBenefitIt" defaultValue={benefit} maxLength={160} className={inputClass.replace("mt-2 ","")}/><button type="button" aria-label="Rimuovi vantaggio" onClick={()=>setBenefitsIt(items=>items.filter((_,itemIndex)=>itemIndex!==index))} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-red-200 text-red-700"><Trash2 className="h-4 w-4"/></button></div>)}</div>
        <button type="button" disabled={benefitsIt.length>=8} onClick={()=>setBenefitsIt(items=>[...items,""])} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700"><Plus className="h-4 w-4"/>Aggiungi vantaggio</button>
      </EditorSection>

      <EditorSection title="Homepage call to action" description="The full-width closing section near the bottom of the homepage.">
        <TextField name="ctaEyebrow" label="Eyebrow" value={content?.callToAction.eyebrow} />
        <TextField name="ctaEyebrowIt" label="Sopratitolo — Italiano" value={content?.callToAction.eyebrowIt} required={false}/>
        <TextField name="ctaTitle" label="Title" value={content?.callToAction.title} />
        <TextField name="ctaTitleIt" label="Titolo — Italiano" value={content?.callToAction.titleIt} required={false}/>
        <TextArea name="ctaDescription" label="Description" value={content?.callToAction.description} />
        <TextArea name="ctaDescriptionIt" label="Descrizione — Italiano" value={content?.callToAction.descriptionIt} required={false}/>
        <ButtonFields prefix="ctaPrimary" title="Primary button" button={content?.callToAction.primaryButton} />
        <ButtonFields prefix="ctaSecondary" title="Secondary button" button={content?.callToAction.secondaryButton} />
      </EditorSection>

      <div className="sticky bottom-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite">{state && <p className={`text-sm font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}</div>
        <button disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"><Save className="h-5 w-5" />{pending ? "Saving…" : "Save homepage"}</button>
      </div>
    </form>
  );
}

function EditorSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-extrabold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><div className="mt-6 grid gap-5">{children}</div></section>;
}

function TextField({ name, label, value,required=true }: { name: string; label: string; value?: string;required?:boolean }) {
  return <label><span className="text-sm font-bold text-slate-700">{label}</span><input name={name} defaultValue={value ?? ""} required={required} className={inputClass} /></label>;
}

function TextArea({ name, label, value,required=true }: { name: string; label: string; value?: string;required?:boolean }) {
  return <label><span className="text-sm font-bold text-slate-700">{label}</span><textarea name={name} defaultValue={value ?? ""} required={required} rows={4} className={`${inputClass} resize-y`} /></label>;
}

function ButtonFields({ prefix, title, button }: { prefix: string; title: string; button?: { label: string;labelIt:string; href: string } }) {
  return <fieldset className="grid gap-4 rounded-2xl border border-slate-200 p-4 sm:grid-cols-2"><legend className="px-2 text-sm font-extrabold text-slate-700">{title}</legend><TextField name={`${prefix}Label`} label="Button label" value={button?.label} /><TextField name={`${prefix}LabelIt`} label="Etichetta — Italiano" value={button?.labelIt} required={false}/><TextField name={`${prefix}Href`} label="Internal link" value={button?.href} /></fieldset>;
}
