"use client";
import { useParams } from "next/navigation";
import uz from "@/messages/uz.json";
import ru from "@/messages/ru.json";
import en from "@/messages/en.json";
export default function PageError({ reset }: { reset: () => void }) {
  const params = useParams();
  const locale =
    params.locale === "ru" ? "ru" : params.locale === "en" ? "en" : "uz";
  const m = { uz, ru, en }[locale];
  return (
    <main className="error-page">
      <a className="brand" href={`/${locale}`}>
        AGROGO.
      </a>
      <h1>{m.error.title}</h1>
      <p>{m.error.text}</p>
      <button className="pill-btn green" onClick={reset}>
        {m.error.retry}
      </button>
    </main>
  );
}
