import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["uz", "ru", "en"].map((locale) => ({
    url: `https://agrogo.salamatdinp.chatgpt.site/${locale}`,
    changeFrequency: "monthly",
    priority: 1,
    alternates: {
      languages: {
        uz: "https://agrogo.salamatdinp.chatgpt.site/uz",
        ru: "https://agrogo.salamatdinp.chatgpt.site/ru",
        en: "https://agrogo.salamatdinp.chatgpt.site/en",
      },
    },
  }));
}
