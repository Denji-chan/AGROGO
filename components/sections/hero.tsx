"use client";
import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  Globe2,
  Sprout,
  Snowflake,
  Tractor,
  Package,
  Truck,
} from "lucide-react";
import { ActionButton, type JoinHandler } from "../shared";

export function Hero({ onJoin }: { onJoin: JoinHandler }) {
  const t = useTranslations("hero"),
    c = useTranslations("common"),
    root = useTranslations();
  const ref = useRef<HTMLElement>(null),
    reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const ribbon = root.raw("ribbon") as string[];
  const icons = [Snowflake, Tractor, Package, Truck, Globe2];
  return (
    <>
      <div className="hero-wrap">
        <section className="hero" ref={ref} aria-labelledby="hero-title">
          <motion.div
            className="hero-image"
            style={{ y: reduced ? 0 : imageY }}
          >
            <Image
              src="/images/hero-farm.webp"
              fill
              priority
              sizes="100vw"
              alt={t("imageAlt")}
            />
          </motion.div>
          <div className="container hero-inner">
            <motion.div
              style={{ y: reduced ? 0 : contentY }}
              className="hero-content"
            >
              <div className="hero-badge">
                <span />
                {t("badge")}
              </div>
              <h1 id="hero-title">
                {["line1", "line2", "line3"].map((key, i) => (
                  <motion.span
                    key={key}
                    className={i === 2 ? "hero-accent" : ""}
                    initial={{ y: reduced ? 0 : 25 }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.12 * i,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {t(key)}
                  </motion.span>
                ))}
              </h1>
              <p className="hero-copy">{t("description")}</p>
              <div className="hero-buttons">
                <ActionButton onClick={() => onJoin()}>
                  {c("start")}
                </ActionButton>
                <a className="pill-btn outline" href="#how-it-works">
                  {c("how")}
                  <ArrowDown size={16} />
                </a>
              </div>
            </motion.div>
            <div className="hero-footer">
              <a href="#problem" className="hero-caption">
                <ArrowDown />
                {t("caption")}
              </a>
              <motion.div
                className="hero-route-card"
                animate={reduced ? {} : { y: [0, -7, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="route-card-top">
                  <span>{t("cardLabel")}</span>
                  <span>01 — 06</span>
                </div>
                <div className="route-card-row">
                  <span className="route-card-icon">
                    <Sprout size={20} />
                  </span>
                  <div>
                    <strong>{t("cardFrom")}</strong>
                    <small>{t("cardFromSub")}</small>
                  </div>
                </div>
                <div className="route-card-path" />
                <div className="route-card-row">
                  <span className="route-card-icon destination">
                    <Globe2 size={20} />
                  </span>
                  <div>
                    <strong>{t("cardTo")}</strong>
                    <small>{t("cardToSub")}</small>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <div className="service-ribbon">
        <div className="container ribbon-content">
          {ribbon.map((label, i) => {
            const Icon = icons[i];
            return (
              <div className="ribbon-item" key={label}>
                <Icon />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
