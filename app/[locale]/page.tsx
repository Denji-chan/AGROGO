import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { SiteProviders } from "@/components/providers";
import { LandingPage } from "@/components/landing-page";
import uz from "@/messages/uz.json";
import ru from "@/messages/ru.json";
import en from "@/messages/en.json";

const dictionaries = { uz, ru, en };
type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = dictionaries[locale].meta;
  return {
    metadataBase: new URL("https://agrogo.salamatdinp.chatgpt.site"),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { uz: "/uz", ru: "/ru", en: "/en", "x-default": "/" },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      type: "website",
      locale: locale === "uz" ? "uz_UZ" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: "AGROGO",
    },
    robots: { index: true, follow: true },
  };
}
export default async function LocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <SiteProviders locale={locale} messages={dictionaries[locale]}>
      <LandingPage />
    </SiteProviders>
  );
}
