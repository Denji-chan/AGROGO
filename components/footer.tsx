"use client";
import { useTranslations } from "next-intl";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Brand, type JoinHandler } from "./shared";
import { LanguageSelect } from "./header";
export function Footer({ onJoin }: { onJoin: JoinHandler }) {
  const t = useTranslations("footer"),
    c = useTranslations("common");
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>{t("tagline")}</p>
          </div>
          <div className="footer-column">
            <h3>{t("navigation")}</h3>
            <a href="#how-it-works">{c("how")}</a>
            <a href="#services">{c("services")}</a>
            <a href="#geography">{c("geography")}</a>
          </div>
          <div className="footer-column">
            <h3>{t("cooperate")}</h3>
            <button onClick={() => onJoin({ role: "farmer" })}>
              {t("farmer")}
            </button>
            <button onClick={() => onJoin({ role: "partner" })}>
              {t("partner")}
            </button>
            <a href="#for-you">{c("audience")}</a>
          </div>
          <div className="footer-contact">
            <h3>{c("contact")}</h3>
            <p>{t("contactText")}</p>
            <a href="#join" className="footer-contact-link">
              {c("contact")}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {t("copyright")}</span>
          <span className="footer-origin">{t("origin")}</span>
          <div>
            <LanguageSelect />
            <a href="#top" className="back-to-top" aria-label={t("top")}>
              <ArrowUp size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
