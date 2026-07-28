import "server-only";

import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { adminDb } from "./firebase-admin";
import type { Locale } from "@/lib/i18n/config";

export const SERVICE_AREAS_COLLECTION = "serviceAreas";

export type ServiceArea = {
  id: string;
  areaName: string;
  areaNameIt: string;
  slug: string;
  shortDescription: string;
  shortDescriptionIt: string;
  fullDescription: string;
  fullDescriptionIt: string;
  featuredImage: string;
  mapsUrl: string;
  seoTitle: string;
  seoTitleIt: string;
  seoDescription: string;
  seoDescriptionIt: string;
  featured: boolean;
  nearbyCities: string[];
  nearbyCitiesIt: string[];
  availabilityNotes: string;
  availabilityNotesIt: string;
  published: boolean;
  displayOrder: number;
};

function mapServiceArea(document: QueryDocumentSnapshot<DocumentData>, locale:Locale="en"): ServiceArea {
  const data = document.data();
  const pick=(en:unknown,it:unknown)=>String(locale==="it"&&String(it??"").trim()?it:en??"");
  return {
    id: document.id,
    areaName: pick(data.areaName,data.areaNameIt),
    areaNameIt:data.areaNameIt??"",
    slug: data.slug ?? "",
    shortDescription: pick(data.shortDescription,data.shortDescriptionIt),
    shortDescriptionIt:data.shortDescriptionIt??"",
    fullDescription: pick(data.fullDescription,data.fullDescriptionIt),
    fullDescriptionIt:data.fullDescriptionIt??"",
    featuredImage: data.featuredImage ?? "",
    mapsUrl: data.mapsUrl ?? "",
    seoTitle: pick(data.seoTitle,data.seoTitleIt),
    seoTitleIt:data.seoTitleIt??"",
    seoDescription: pick(data.seoDescription,data.seoDescriptionIt),
    seoDescriptionIt:data.seoDescriptionIt??"",
    featured: Boolean(data.featured),
    nearbyCities: locale==="it"&&Array.isArray(data.nearbyCitiesIt)&&data.nearbyCitiesIt.length?data.nearbyCitiesIt:Array.isArray(data.nearbyCities) ? data.nearbyCities : [],
    nearbyCitiesIt: Array.isArray(data.nearbyCitiesIt) ? data.nearbyCitiesIt : [],
    availabilityNotes: pick(data.availabilityNotes,data.availabilityNotesIt),
    availabilityNotesIt:data.availabilityNotesIt??"",
    published: Boolean(data.published),
    displayOrder: Number(data.displayOrder ?? 0),
  };
}

const listCachedServiceAreas = unstable_cache(async (locale:Locale="en"): Promise<ServiceArea[]> => {
  const snapshot = await adminDb.collection(SERVICE_AREAS_COLLECTION).get();
  return snapshot.docs.map(document=>mapServiceArea(document,locale)).sort((left, right) => left.displayOrder - right.displayOrder || left.areaName.localeCompare(right.areaName));
},["service-areas"],{revalidate:300,tags:["service-areas"]});

export async function listServiceAreas(locale:Locale="en") {
  return listCachedServiceAreas(locale);
}

export async function listPublishedServiceAreas(locale:Locale="en"): Promise<ServiceArea[]> {
  return (await listServiceAreas(locale)).filter(area => area.published);
}
