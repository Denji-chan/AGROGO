import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["uz", "ru", "en"].map((locale) => ({
    url: new URL(`/${locale}`, siteUrl()).href,
    changeFrequency: "monthly",
    priority: 1,
    alternates: {
      languages: {
        uz: new URL("/uz", siteUrl()).href,
        ru: new URL("/ru", siteUrl()).href,
        en: new URL("/en", siteUrl()).href,
      },
    },
  }));
}
