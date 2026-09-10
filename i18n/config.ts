export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);
export function preferredLocale(acceptLanguage: string | null): Locale {
  const ranked = (acceptLanguage || "")
    .split(",")
    .map((entry) => {
      const [tag, quality] = entry.trim().split(";q=");
      return {
        locale: tag.toLowerCase().split("-")[0],
        q: quality === undefined ? 1 : Number(quality),
      };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q);
  return (
    (ranked.find((entry) => isLocale(entry.locale))?.locale as Locale) || "uz"
  );
}
