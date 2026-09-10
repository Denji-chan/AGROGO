"use client";
import { useTranslations } from "next-intl";
import { Snowflake, Tractor, Truck, Globe2 } from "lucide-react";
import { Reveal, Title } from "../shared";
export function Problem() {
  const t = useTranslations("problem"),
    items = t.raw("items") as { title: string; text: string }[];
  const icons = [Snowflake, Tractor, Truck, Globe2];
  return (
    <section id="problem" className="section problem-section">
      <div className="container">
        <Reveal>
          <div className="eyebrow">{t("eyebrow")}</div>
          <div className="section-intro">
            <Title text={t("title")} />
            <p>{t("description")}</p>
          </div>
        </Reveal>
        <div className="problem-grid">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <article className="problem-card">
                  <div className="problem-card-top">
                    <Icon size={29} strokeWidth={1.4} />
                    <span>0{i + 1}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
