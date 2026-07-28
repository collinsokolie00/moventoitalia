import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api",
        "/api/",
        "/preview",
        "/preview/",
        "/quote/success",
        "/quote/result",
        "/quote/confirmation",
        "/booking",
        "/booking/success",
        "/error",
        "/result",
      ],
    },
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
    host: baseUrl.origin,
  };
}
