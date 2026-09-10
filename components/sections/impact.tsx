"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useInView, useReducedMotion, animate } from "framer-motion";
import { Reveal, Title } from "../shared";
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null),
    view = useInView(ref, { once: true }),
    reduced = useReducedMotion(),
    locale = useLocale();
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (!view || reduced) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (n) => setCount(Math.round(n)),
    });
    return () => controls.stop();
  }, [view, reduced, value]);
  return <span ref={ref}>{new Intl.NumberFormat(locale).format(count)}</span>;
}
export function Impact() {
  const t = useTranslations("impact"),
    stats = t.raw("stats") as {
      value: number;
      suffix: string;
      label: string;
      text: string;
    }[];
  return (
    <section className="section impact-section">
      <div className="container">
        <Reveal>
          <div className="eyebrow">{t("eyebrow")}</div>
          <div className="section-intro">
            <Title text={t("title")} />
            <p>{t("description")}</p>
          </div>
        </Reveal>
        <div className="impact-stats">
          {stats.map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="impact-stat">
                <strong>
                  <Counter value={stat.value} />
                  {stat.suffix}
                  <span className="stat-accent">/</span>
                </strong>
                <h3>{stat.label}</h3>
                <p>{stat.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="fine-note">{t("note")}</p>
      </div>
    </section>
  );
}
