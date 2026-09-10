"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, ArrowUpRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Reveal, Title, ActionButton, type JoinHandler } from "../shared";
const images = ["hero-farm", "warehouse", "machinery", "logistics"];
export function Audience({ onJoin }: { onJoin: JoinHandler }) {
  const t = useTranslations("audience"),
    root = useTranslations(),
    tabs = t.raw("tabs") as string[],
    items = t.raw("items") as {
      title: string;
      text: string;
      benefits: string[];
      cta: string;
    }[];
  const alts = [
    root("hero.imageAlt"),
    root("services.items.0.alt"),
    root("services.items.1.alt"),
    root("services.items.3.alt"),
  ];
  return (
    <section className="section audience-section" id="for-you">
      <div className="container">
        <Reveal>
          <div className="eyebrow">{t("eyebrow")}</div>
          <div className="section-intro">
            <Title text={t("title")} />
            <ArrowUpRight className="section-arrow" size={60} strokeWidth={1} />
          </div>
        </Reveal>
        <Tabs defaultValue="0" className="audience-tabs">
          <TabsList className="audience-tab-list">
            {tabs.map((tab, i) => (
              <TabsTrigger key={i} value={String(i)}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {items.map((item, i) => (
            <TabsContent key={i} value={String(i)}>
              <div className="audience-panel">
                <div className="audience-photo">
                  <Image
                    src={`/images/${images[i]}.webp`}
                    fill
                    sizes="(max-width: 767px) 90vw, 48vw"
                    alt={alts[i]}
                  />
                  <span className="audience-image-caption">
                    AGROGO / 0{i + 1}
                  </span>
                </div>
                <div className="audience-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <ul>
                    {item.benefits.map((benefit) => (
                      <li key={benefit}>
                        <span>
                          <Check size={13} />
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <ActionButton
                    className="green"
                    onClick={() =>
                      onJoin({
                        role: i === 0 ? "farmer" : "partner",
                        service:
                          i === 1
                            ? "storage"
                            : i === 2
                              ? "equipment"
                              : i === 3
                                ? "export"
                                : undefined,
                      })
                    }
                  >
                    {item.cta}
                  </ActionButton>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
