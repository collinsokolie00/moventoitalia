import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Movento",
    short_name: "Movento",
    description: "Professional moving services across Central Italy.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#172554",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
