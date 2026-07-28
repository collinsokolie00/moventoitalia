import { localePath, type Locale } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/seo";
import JsonLd from "./JsonLd";

export default async function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: Locale;
  items: Array<{ name: string; path: string }>;
}) {
  const siteUrl = await getSiteUrl();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: new URL(localePath(locale, item.path), siteUrl).toString(),
        })),
      }}
    />
  );
}
