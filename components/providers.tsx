"use client";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { useEffect } from "react";

export function SiteProviders({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Record<string, unknown>;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages as AbstractIntlMessages}
      timeZone="Asia/Tashkent"
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="agrogo-theme"
      >
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
