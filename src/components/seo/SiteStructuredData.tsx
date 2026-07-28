import { getContactContent } from "@/lib/database/contact";
import { getSiteChrome } from "@/lib/database/site-chrome";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import JsonLd from "./JsonLd";

export default async function SiteStructuredData() {
  const [contact, chrome, siteUrl] = await Promise.all([
    getContactContent("en"),
    getSiteChrome("en"),
    getSiteUrl(),
  ]);
  const logo = await absoluteUrl(chrome?.companyLogo || "");
  const organizationId = new URL("/#organization", siteUrl).toString();
  const businessId = new URL("/#moving-company", siteUrl).toString();

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": organizationId,
            name: "Movento",
            url: siteUrl.toString(),
            email: "info@moventoitalia.com",
            logo: logo || undefined,
          },
          {
            "@type": "MovingCompany",
            "@id": businessId,
            name: "Movento",
            url: siteUrl.toString(),
            email: "info@moventoitalia.com",
            telephone: contact?.phone || undefined,
            address: contact?.address || undefined,
            image: logo || undefined,
            areaServed: ["Terni", "Perugia", "Rome", "Umbria", "Lazio"],
            parentOrganization: { "@id": organizationId },
            contactPoint: contact?.phone
              ? {
                  "@type": "ContactPoint",
                  telephone: contact.phone,
                  contactType: "customer service",
                  availableLanguage: ["English", "Italian"],
                }
              : undefined,
          },
        ],
      }}
    />
  );
}
