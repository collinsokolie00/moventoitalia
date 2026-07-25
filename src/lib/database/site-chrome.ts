import "server-only";
import { adminDb } from "./firebase-admin";
import type { Locale } from "@/lib/i18n/config";

export const SITE_CHROME_COLLECTION = "siteContent";
export const SITE_CHROME_DOCUMENT = "headerFooter";
export type ChromeLink = { label:string;labelIt:string; href:string; order:number; visible:boolean };
export type FooterGroup = { title:string;titleIt:string; links:Array<{label:string;labelIt:string;href:string}> };
export type SocialLink = { label:string; href:string };
export type SiteChrome = {
  companyName:string; companyLogo:string; navigation:ChromeLink[];
  headerCta:{label:string;labelIt:string;href:string}; footerLogo:string; footerDescription:string;footerDescriptionIt:string;
  socialLinks:SocialLink[]; copyrightText:string;copyrightTextIt:string; footerTagline:string;footerTaglineIt:string;
  footerNavigation:FooterGroup[];
  footerCta:{title:string;titleIt:string;description:string;descriptionIt:string;buttonLabel:string;buttonLabelIt:string;buttonHref:string};
};
export async function getSiteChrome(locale:Locale="en"):Promise<SiteChrome|null>{const snapshot=await adminDb.collection(SITE_CHROME_COLLECTION).doc(SITE_CHROME_DOCUMENT).get();if(!snapshot.exists)return null;const data=snapshot.data() as SiteChrome;const pick=(en:unknown,it:unknown)=>String(locale==="it"&&String(it??"").trim()?it:en??"");return{companyName:data.companyName,companyLogo:data.companyLogo,navigation:[...(data.navigation??[])].sort((a,b)=>a.order-b.order).map(item=>({...item,label:pick(item.label,item.labelIt),labelIt:item.labelIt??""})),headerCta:{...data.headerCta,label:pick(data.headerCta.label,data.headerCta.labelIt),labelIt:data.headerCta.labelIt??""},footerLogo:data.footerLogo,footerDescription:pick(data.footerDescription,data.footerDescriptionIt),footerDescriptionIt:data.footerDescriptionIt??"",socialLinks:data.socialLinks??[],copyrightText:pick(data.copyrightText,data.copyrightTextIt),copyrightTextIt:data.copyrightTextIt??"",footerTagline:pick(data.footerTagline,data.footerTaglineIt),footerTaglineIt:data.footerTaglineIt??"",footerNavigation:(data.footerNavigation??[]).map(group=>({...group,title:pick(group.title,group.titleIt),titleIt:group.titleIt??"",links:group.links.map(link=>({...link,label:pick(link.label,link.labelIt),labelIt:link.labelIt??""}))})),footerCta:{...data.footerCta,title:pick(data.footerCta.title,data.footerCta.titleIt),titleIt:data.footerCta.titleIt??"",description:pick(data.footerCta.description,data.footerCta.descriptionIt),descriptionIt:data.footerCta.descriptionIt??"",buttonLabel:pick(data.footerCta.buttonLabel,data.footerCta.buttonLabelIt),buttonLabelIt:data.footerCta.buttonLabelIt??""}};}
