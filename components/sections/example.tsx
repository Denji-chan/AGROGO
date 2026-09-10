"use client";
import { useTranslations } from "next-intl";
import { Sprout, Package, Truck, Handshake, ArrowRight } from "lucide-react";
import { Reveal, Title } from "../shared";
export function Example() {
  const t = useTranslations("example"),
    steps = t.raw("steps") as string[];
  const icons = [Sprout, Package, Truck, Handshake];
  return (
    <section className="example-section">
      <div className="container">
        <Reveal>
          <div className="example-layout">
            <div>
              <div className="eyebrow">{t("eyebrow")}</div>
              <Title text={t("title")} />
              <p className="example-description">{t("description")}</p>
            </div>
            <div className="commission-card">
              <div>
                <span className="commission-label">{t("commissionTitle")}</span>
                <strong>{t("commission")}</strong>
              </div>
              <p>{t("commissionText")}</p>
            </div>
          </div>
          <div className="example-steps">
            {steps.map((label, i) => {
              const Icon = icons[i];
              return (
                <div className="example-step" key={label}>
                  <span className="example-icon">
                    <Icon size={25} strokeWidth={1.5} />
                  </span>
                  <span>{label}</span>
                  {i < 3 && <ArrowRight className="example-arrow" size={20} />}
                </div>
              );
            })}
          </div>
          <p className="fine-note">{t("note")}</p>
        </Reveal>
      </div>
    </section>
  );
}
