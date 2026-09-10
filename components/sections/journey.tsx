"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sprout,
  Network,
  Snowflake,
  Package,
  Truck,
  Globe2,
  ArrowUpRight,
} from "lucide-react";
import { Reveal, Title, type JoinHandler } from "../shared";
const photos = [
  "hero-farm",
  "hero-farm",
  "warehouse",
  "warehouse",
  "logistics",
  "logistics",
];
const icons = [Sprout, Network, Snowflake, Package, Truck, Globe2];
export function Journey({ onJoin }: { onJoin: JoinHandler }) {
  const t = useTranslations("journey"),
    c = useTranslations("common"),
    root = useTranslations();
  const steps = t.raw("steps") as {
    name: string;
    title: string;
    text: string;
    tag: string;
  }[];
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add(
          "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)",
          () => {
            ScrollTrigger.create({
              trigger: section.current,
              pin: pin.current,
              start: "top 90px",
              end: "+=1100",
              anticipatePin: 1,
              onUpdate: (self) =>
                setActive(Math.min(5, Math.floor(self.progress * 6))),
            });
          },
        );
        cleanup = () => mm.revert();
      },
    );
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
  const Icon = icons[active];
  const alt =
    active === 2 || active === 3
      ? root("services.items.0.alt")
      : active > 3
        ? root("services.items.3.alt")
        : root("hero.imageAlt");
  return (
    <section id="how-it-works" ref={section} className="journey-section">
      <div ref={pin} className="journey-pin">
        <div className="container">
          <div className="journey-heading">
            <Reveal>
              <div className="eyebrow">{t("eyebrow")}</div>
              <Title text={t("title")} />
            </Reveal>
            <p>{t("description")}</p>
          </div>
          <div className="journey-body">
            <div className="journey-photo">
              <Image
                src={`/images/${photos[active]}.webp`}
                alt={alt}
                fill
                sizes="(max-width: 767px) 90vw, 50vw"
              />
              <div className="journey-photo-tag">
                <Icon size={17} />
                {steps[active].tag}
              </div>
              <div className="journey-photo-mark">
                AGROGO<span>.</span>
              </div>
            </div>
            <div
              className="journey-detail"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="step-counter">
                0{active + 1}
                <span> / 06</span>
              </span>
              <h3>{steps[active].title}</h3>
              <p>{steps[active].text}</p>
              <button className="journey-link" onClick={() => onJoin()}>
                {c("start")}
                <ArrowUpRight size={21} />
              </button>
            </div>
          </div>
          <div className="journey-steps" aria-label={t("stepLabel")}>
            {steps.map((step, i) => {
              const StepIcon = icons[i];
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`journey-step ${i <= active ? "is-reached" : ""} ${i === active ? "is-active" : ""}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className="journey-step-node">
                    <StepIcon size={21} />
                  </span>
                  <span>{step.name}</span>
                </button>
              );
            })}
          </div>
          <p className="journey-hint">{t("hint")}</p>
        </div>
      </div>
    </section>
  );
}
