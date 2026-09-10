"use client";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Brand, ActionButton, type JoinHandler } from "./shared";

export function LanguageSelect() {
  const t = useTranslations("common"),
    locale = useLocale();
  function change(value: string) {
    document.cookie = `agrogo_locale=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    location.assign(`/${value}${location.hash}`);
  }
  return (
    <Select value={locale} onValueChange={change}>
      <SelectTrigger className="language-select" aria-label={t("language")}>
        <SelectValue>{locale.toUpperCase()}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper">
        {["uz", "ru", "en"].map((l) => (
          <SelectItem value={l} key={l}>
            {t(l)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function Header({ onJoin }: { onJoin: JoinHandler }) {
  const t = useTranslations("common"),
    { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const links = [
    ["how", "how-it-works"],
    ["services", "services"],
    ["geography", "geography"],
    ["audience", "for-you"],
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <motion.div
        className="progress-line"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label={t("menu")}>
            {links.map(([label, id]) => (
              <a href={`#${id}`} key={id}>
                {t(label)}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <LanguageSelect />
            <button
              className="theme-button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label={
                mounted && resolvedTheme === "dark" ? t("light") : t("dark")
              }
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>
            <ActionButton
              className="green header-join"
              onClick={() => onJoin()}
            >
              {t("join")}
            </ActionButton>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="menu-button" aria-label={t("menu")}>
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent className="mobile-sheet" showCloseButton={false}>
                <SheetHeader>
                  <SheetTitle>AGROGO</SheetTitle>
                  <SheetDescription>{t("menu")}</SheetDescription>
                </SheetHeader>
                <SheetClose className="sheet-close" aria-label={t("close")}>
                  <X />
                </SheetClose>
                <nav>
                  {links.map(([label, id]) => (
                    <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>
                      {t(label)}
                      <ArrowUpRight size={20} />
                    </a>
                  ))}
                </nav>
                <ActionButton
                  onClick={() => {
                    setOpen(false);
                    onJoin();
                  }}
                >
                  {t("join")}
                </ActionButton>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
