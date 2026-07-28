import "server-only";

import { unstable_cache } from "next/cache";
import { adminDb } from "./firebase-admin";
import { normalizeSlides, type PromoSlide } from "./site-media";
import type { Locale } from "@/lib/i18n/config";

export const HOMEPAGE_COLLECTION = "siteContent";
export const HOMEPAGE_DOCUMENT = "homepage";

export type HomepageButton = {
  label: string;
  labelIt: string;
  href: string;
};

export type HomepageStatistic = {
  value: string;
  valueIt: string;
  label: string;
  labelIt: string;
};

export type HomepageContent = {
  hero: {
    title: string;
    titleIt: string;
    subtitle: string;
    subtitleIt: string;
    primaryButton: HomepageButton;
    secondaryButton: HomepageButton;
  };
  statistics: HomepageStatistic[];
  whyChoose: {
    title: string;
    titleIt: string;
    description: string;
    descriptionIt: string;
    benefits: string[];
    benefitsIt: string[];
  };
  callToAction: {
    eyebrow: string;
    eyebrowIt: string;
    title: string;
    titleIt: string;
    description: string;
    descriptionIt: string;
    primaryButton: HomepageButton;
    secondaryButton: HomepageButton;
  };
  bannerSlides: PromoSlide[];
};

const getCachedHomepageContent = unstable_cache(async (locale:Locale="en"): Promise<HomepageContent | null> => {
  const snapshot = await adminDb
    .collection(HOMEPAGE_COLLECTION)
    .doc(HOMEPAGE_DOCUMENT)
    .get();

  if (!snapshot.exists) return null;
  const data = snapshot.data() as HomepageContent;
  const pick=(en:unknown,it:unknown)=>String(locale==="it"&&String(it??"").trim()?it:en??"");
  const button=(value:HomepageButton)=>({...value,label:pick(value.label,value.labelIt),labelIt:value.labelIt??""});
  return {
    hero: {...data.hero,title:pick(data.hero.title,data.hero.titleIt),titleIt:data.hero.titleIt??"",subtitle:pick(data.hero.subtitle,data.hero.subtitleIt),subtitleIt:data.hero.subtitleIt??"",primaryButton:button(data.hero.primaryButton),secondaryButton:button(data.hero.secondaryButton)},
    statistics: (data.statistics??[]).map(item=>({...item,value:pick(item.value,item.valueIt),valueIt:item.valueIt??"",label:pick(item.label,item.labelIt),labelIt:item.labelIt??""})),
    whyChoose: {...data.whyChoose,title:pick(data.whyChoose.title,data.whyChoose.titleIt),titleIt:data.whyChoose.titleIt??"",description:pick(data.whyChoose.description,data.whyChoose.descriptionIt),descriptionIt:data.whyChoose.descriptionIt??"",benefits:locale==="it"&&data.whyChoose.benefitsIt?.length?data.whyChoose.benefitsIt:data.whyChoose.benefits,benefitsIt:data.whyChoose.benefitsIt??[]},
    callToAction: {...data.callToAction,eyebrow:pick(data.callToAction.eyebrow,data.callToAction.eyebrowIt),eyebrowIt:data.callToAction.eyebrowIt??"",title:pick(data.callToAction.title,data.callToAction.titleIt),titleIt:data.callToAction.titleIt??"",description:pick(data.callToAction.description,data.callToAction.descriptionIt),descriptionIt:data.callToAction.descriptionIt??"",primaryButton:button(data.callToAction.primaryButton),secondaryButton:button(data.callToAction.secondaryButton)},
    bannerSlides: normalizeSlides(data.bannerSlides,locale),
  };
},["homepage-content"],{revalidate:300,tags:["homepage-content"]});

export async function getHomepageContent(locale:Locale="en") {
  return getCachedHomepageContent(locale);
}
