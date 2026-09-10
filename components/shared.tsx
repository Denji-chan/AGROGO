"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sprout } from "lucide-react";

export type JoinIntent = {
  role: "farmer" | "partner";
  service?: string;
  region?: string;
  revision?: number;
};
export type JoinHandler = (intent?: Partial<JoinIntent>) => void;
export const serviceKeys = [
  "storage",
  "equipment",
  "packing",
  "transport",
  "export",
] as const;
export const regionKeys = [
  "nukus",
  "khorezm",
  "bukhara",
  "samarkand",
  "tashkent",
] as const;
export function Brand() {
  return (
    <a className="brand" href="#top" aria-label="AGROGO">
      <span className="brand-symbol">
        <Sprout size={24} strokeWidth={2} />
      </span>
      AGROGO<span className="brand-dot">.</span>
    </a>
  );
}
export function ActionButton({
  children,
  onClick,
  className = "yellow",
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}) {
  const content = (
    <>
      {children}
      <span className="btn-icon">
        <ArrowUpRight size={18} />
      </span>
    </>
  );
  return href ? (
    <a className={`pill-btn ${className}`} href={href}>
      {content}
    </a>
  ) : (
    <button className={`pill-btn ${className}`} type="button" onClick={onClick}>
      {content}
    </button>
  );
}
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -35px 0px" });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={`reveal ${className}`}
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0 }
          : { opacity: reduced ? 1 : 0.25, y: reduced ? 0 : 30 }
      }
      transition={{
        duration: reduced ? 0 : 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
export function Title({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <h2 className={`section-heading ${className}`}>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}
