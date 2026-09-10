import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { preferredLocale } from "@/i18n/config";

export default async function RootPage() {
  const h = await headers();
  redirect(`/${preferredLocale(h.get("accept-language"))}`);
}
