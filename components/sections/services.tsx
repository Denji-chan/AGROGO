"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, type PointerEvent } from "react";
import {
  ArrowUpRight,
  Snowflake,
  Tractor,
  Package,
  Truck,
  Globe2,
} from "lucide-react";
import {
  ActionButton,
  Reveal,
  Title,
  serviceKeys,
  type JoinHandler,
} from "../shared";
const photos = [
  "warehouse",
  "machinery",
  "warehouse",
  "logistics",
  "hero-farm",
];
const icons = [Snowflake, Tractor, Package, Truck, Globe2];
function ServiceCard({
  item,
  index,
  onJoin,
}: {
  item: { title: string; text: string; tag: string; alt: string };
  index: number;
  onJoin: JoinHandler;
}) {
  const ref = useRef<HTMLElement>(null),
    t = useTranslations("services");
  const Icon = icons[index];
  const move = (e: PointerEvent<HTMLElement>) => {
    if (
      e.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5,
      y = (e.clientY - b.top) / b.height - 0.5;
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
  };
  return (
    <article
      ref={ref}
      className={`service-card service-${index}`}
      onPointerMove={move}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      <div className="service-photo">
        <Image
          src={`/images/${photos[index]}.webp`}
          alt={item.alt}
          fill
          sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 33vw"
          style={{ objectPosition: index === 2 ? "right bottom" : "center" }}
        />
        <span className="service-photo-label">{item.tag}</span>
        <span className="service-number">0{index + 1}</span>
      </div>
      <div className="service-card-content">
        <div className="service-title">
          <Icon size={24} strokeWidth={1.5} />
          <h3>{item.title}</h3>
        </div>
        <p>{item.text}</p>
        <button
          className="service-card-link"
          onClick={() =>
            onJoin({ role: "farmer", service: serviceKeys[index] })
          }
          aria-label={`${t("request")}: ${item.title}`}
        >
          <ArrowUpRight size={22} />
        </button>
      </div>
    </article>
  );
}
export function Services({ onJoin }: { onJoin: JoinHandler }) {
  const t = useTranslations("services"),
    items = t.raw("items") as {
      title: string;
      text: string;
      tag: string;
      alt: string;
    }[];
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <Reveal>
          <div className="eyebrow">{t("eyebrow")}</div>
          <div className="section-intro">
            <Title text={t("title")} />
            <div className="services-intro-side">
              <p>{t("description")}</p>
              <ActionButton
                className="text"
                onClick={() => onJoin({ role: "partner" })}
              >
                {t("all")}
              </ActionButton>
            </div>
          </div>
        </Reveal>
        <div className="services-grid">
          {items.map((item, i) => (
            <Reveal
              key={i}
              delay={(i % 3) * 0.06}
              className={i > 2 ? "wide-service" : ""}
            >
              <ServiceCard item={item} index={i} onJoin={onJoin} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
