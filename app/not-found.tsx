import { headers } from "next/headers";
import uz from "@/messages/uz.json";
import ru from "@/messages/ru.json";
import en from "@/messages/en.json";
export default async function NotFound() {
  const h = await headers();
  const selected = h.get("x-agrogo-locale");
  const locale = selected === "ru" ? "ru" : selected === "en" ? "en" : "uz";
  const m = { uz, ru, en }[locale];
  return (
    <main className="error-page">
      <a className="brand" href={`/${locale}`}>
        AGROGO.
      </a>
      <span>404</span>
      <h1>{m.error.notFound}</h1>
      <a className="pill-btn green" href={`/${locale}`}>
        {m.common.back}
      </a>
    </main>
  );
}
