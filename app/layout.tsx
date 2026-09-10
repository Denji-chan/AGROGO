import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/manrope";
import "./globals.css";
export const metadata: Metadata = {
  title: "AGROGO — Fermerdan eksportgacha",
  description: "Fermer, ombor, agrotexnika va eksport. Bitta platformada.",
  icons: { icon: "/favicon.svg" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const locale = h.get("x-agrogo-locale") || "uz";
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
