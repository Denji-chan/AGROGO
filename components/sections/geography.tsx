"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useInView, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Warehouse,
  Tractor,
  Globe2,
  ArrowRight,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import outline from "@/data/uzbekistan.json";
import { Title, Reveal, regionKeys, type JoinHandler } from "../shared";
const ExportGlobe = dynamic(() => import("../three/export-globe"), {
  ssr: false,
});
const points = [
  [59.61, 42.46],
  [60.63, 41.55],
  [64.42, 39.77],
  [66.97, 39.65],
  [69.24, 41.3],
];
const samples = [
  [8, 14],
  [12, 22],
  [9, 17],
  [16, 28],
  [24, 31],
];
const project = (lon: number, lat: number) => [
  (lon - 55.8) * 40 + 25,
  (46 - lat) * 58 + 20,
];
const geometry = outline as { type: string; coordinates: number[][][] };
const mapPath = geometry.coordinates
  .map(
    (ring) =>
      ring
        .map(
          ([lon, lat], i) =>
            `${i ? "L" : "M"}${project(lon, lat)
              .map((v) => v.toFixed(1))
              .join(",")}`,
        )
        .join(" ") + "Z",
  )
  .join(" ");
class GlobeBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function Geography({ onJoin }: { onJoin: JoinHandler }) {
  const t = useTranslations("geography");
  const regions = t.raw("regions") as string[],
    countries = t.raw("countries") as string[];
  const [region, setRegion] = useState(4),
    [market, setMarket] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const ref = useRef<HTMLDivElement>(null),
    visible = useInView(ref, { margin: "150px" }),
    reduced = useReducedMotion();
  useEffect(() => {
    const query = matchMedia("(min-width: 768px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const fallback = (
    <div className="globe-fallback">
      <img src="/world-map.svg" alt="" />
      <Globe2 size={90} strokeWidth={0.8} />
      <p>{t("globeFallback")}</p>
    </div>
  );
  return (
    <section className="section geography-section" id="geography">
      <div className="container">
        <Reveal>
          <div className="eyebrow">{t("eyebrow")}</div>
          <div className="section-intro">
            <Title text={t("title")} />
            <p>{t("description")}</p>
          </div>
        </Reveal>
        <Tabs defaultValue="local" className="geography-tabs">
          <TabsList className="geo-tab-list">
            <TabsTrigger value="local">
              <MapPin size={16} />
              {t("local")}
            </TabsTrigger>
            <TabsTrigger value="export">
              <Globe2 size={16} />
              {t("export")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="local">
            <div className="local-map-layout">
              <div className="map-area">
                <svg
                  viewBox="0 0 760 555"
                  role="img"
                  aria-label={t("mapAlt")}
                  className="uzbekistan-map"
                >
                  <defs>
                    <linearGradient id="map-fill" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#d4e4bb" />
                      <stop offset="100%" stopColor="#a8c28d" />
                    </linearGradient>
                    <pattern
                      id="map-grid"
                      width="30"
                      height="30"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 30 0 L 0 0 0 30"
                        fill="none"
                        stroke="#86a471"
                        strokeWidth=".7"
                        opacity=".25"
                      />
                    </pattern>
                  </defs>
                  <path
                    d={mapPath}
                    fill="url(#map-fill)"
                    stroke="#87a274"
                    strokeWidth="1.5"
                  />
                  <path d={mapPath} fill="url(#map-grid)" />
                  <path
                    d={points
                      .map(
                        ([lon, lat], i) =>
                          `${i ? "L" : "M"}${project(lon, lat).join(",")}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke="#4f7850"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                  />
                </svg>
                {points.map(([lon, lat], i) => {
                  const [x, y] = project(lon, lat);
                  return (
                    <button
                      key={i}
                      className={`map-marker ${region === i ? "selected" : ""}`}
                      style={{
                        left: `${(x / 760) * 100}%`,
                        top: `${(y / 555) * 100}%`,
                      }}
                      onMouseEnter={() => setRegion(i)}
                      onFocus={() => setRegion(i)}
                      onClick={() => setRegion(i)}
                      aria-pressed={region === i}
                      aria-label={regions[i]}
                    >
                      <span className="map-dot" />
                      <span className={`map-city city-${i}`}>{regions[i]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="region-panel" aria-live="polite">
                <span className="region-panel-kicker">
                  <MapPin size={14} />
                  {t("mapLabel")}
                </span>
                <h3>{regions[region]}</h3>
                <div className="region-stats">
                  <div>
                    <Warehouse size={22} />
                    <strong>{samples[region][0]}</strong>
                    <span>{t("warehouse")}</span>
                  </div>
                  <div>
                    <Tractor size={22} />
                    <strong>{samples[region][1]}</strong>
                    <span>{t("equipment")}</span>
                  </div>
                </div>
                <p className="sample-note">{t("demo")}</p>
                <button
                  className="region-join"
                  onClick={() => onJoin({ region: regionKeys[region] })}
                >
                  {t("regionCta")}
                  <ArrowUpRight size={19} />
                </button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="export">
            <div className="export-layout" ref={ref}>
              <div
                className="globe-container"
                role="img"
                aria-label={t("globeLabel")}
              >
                {desktop && !reduced && visible ? (
                  <GlobeBoundary fallback={fallback}>
                    <ExportGlobe active={market} visible={visible} />
                  </GlobeBoundary>
                ) : (
                  fallback
                )}
              </div>
              <div className="export-markets">
                <span className="eyebrow">{t("planned")}</span>
                {countries.map((country, i) => (
                  <button
                    className={`market-row ${market === i ? "active" : ""}`}
                    onClick={() => setMarket(i)}
                    key={i}
                    aria-pressed={market === i}
                  >
                    <span className="market-code">
                      {["KZ", "RU", "KG", "AE"][i]}
                    </span>
                    <span>{country}</span>
                    <ArrowRight size={20} />
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
