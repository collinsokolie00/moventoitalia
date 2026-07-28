import "server-only";

import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { adminDb } from "./firebase-admin";
import { localizedRequired, normalizeLocalized, type Localizable, type Localized } from "@/lib/i18n/localized";
import type { Locale } from "@/lib/i18n/config";

export const SERVICES_COLLECTION = "services";

export type Service = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  displayOrder: number;
};

export type LocalizedService = Omit<Service,"title"|"subtitle"|"description"|"features"|"seoTitle"|"seoDescription"> & { title:Localized<string>; subtitle:Localized<string>; description:Localized<string>; features:Localized<string[]>; seoTitle:Localized<string>; seoDescription:Localized<string> };

function mapService(document: QueryDocumentSnapshot<DocumentData>, locale:Locale="en"): Service {
  const data = document.data();
  return {
    id: document.id,
    slug: data.slug ?? "",
    title: localizedRequired(data.title as Localizable<string>,locale),
    subtitle: localizedRequired(data.subtitle as Localizable<string>,locale),
    description: localizedRequired(data.description as Localizable<string>,locale),
    features: (typeof data.features==="object"&&!Array.isArray(data.features)?data.features?.[locale]??data.features?.en:data.features) ?? [],
    icon: data.icon ?? "Truck",
    image: data.image ?? "",
    seoTitle: localizedRequired(data.seoTitle as Localizable<string>,locale),
    seoDescription: localizedRequired(data.seoDescription as Localizable<string>,locale),
    published: Boolean(data.published),
    displayOrder: Number(data.displayOrder ?? 0),
  };
}

const listCachedServices = unstable_cache(async (locale:Locale="en"): Promise<Service[]> => {
  const snapshot = await adminDb.collection(SERVICES_COLLECTION).get();
  return snapshot.docs
    .map(document=>mapService(document,locale))
    .sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title));
},["services"],{revalidate:300,tags:["services"]});

export async function listServices(locale:Locale="en") {
  return listCachedServices(locale);
}

export async function listPublishedServices(locale:Locale="en"): Promise<Service[]> {
  return (await listServices(locale)).filter((service) => service.published);
}

const listCachedLocalizedServices=unstable_cache(async ():Promise<LocalizedService[]> => { const snapshot=await adminDb.collection(SERVICES_COLLECTION).get();return snapshot.docs.map(document=>{const data=document.data();return{id:document.id,slug:data.slug??"",title:normalizeLocalized(data.title,""),subtitle:normalizeLocalized(data.subtitle,""),description:normalizeLocalized(data.description,""),features:normalizeLocalized(data.features,[]),icon:data.icon??"Truck",image:data.image??"",seoTitle:normalizeLocalized(data.seoTitle,""),seoDescription:normalizeLocalized(data.seoDescription,""),published:Boolean(data.published),displayOrder:Number(data.displayOrder??0)};}).sort((a,b)=>a.displayOrder-b.displayOrder||a.title.en.localeCompare(b.title.en));},["localized-services"],{revalidate:300,tags:["services"]});

export async function listLocalizedServices() {
  return listCachedLocalizedServices();
}
