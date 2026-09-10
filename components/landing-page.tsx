"use client";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Header } from "./header";
import { Hero } from "./sections/hero";
import { Problem } from "./sections/problem";
import { Journey } from "./sections/journey";
import { Services } from "./sections/services";
import { Example } from "./sections/example";
import { Geography } from "./sections/geography";
import { Audience } from "./sections/audience";
import { Impact } from "./sections/impact";
import { Join } from "./sections/join";
import { Footer } from "./footer";
import type { JoinIntent, JoinHandler } from "./shared";
export function LandingPage() {
  const [intent, setIntent] = useState<JoinIntent>({
      role: "farmer",
      revision: 0,
    }),
    reduced = useReducedMotion();
  const join: JoinHandler = (next = {}) => {
    setIntent((prev) => ({
      ...next,
      role: next.role || "farmer",
      revision: (prev.revision || 0) + 1,
    }));
    requestAnimationFrame(() =>
      document
        .getElementById("join")
        ?.scrollIntoView({
          behavior: reduced ? "instant" : "smooth",
          block: "start",
        }),
    );
  };
  return (
    <div id="top">
      <Header onJoin={join} />
      <main id="main">
        <Hero onJoin={join} />
        <Problem />
        <Journey onJoin={join} />
        <Services onJoin={join} />
        <Example />
        <Geography onJoin={join} />
        <Audience onJoin={join} />
        <Impact />
        <Join intent={intent} />
      </main>
      <Footer onJoin={join} />
    </div>
  );
}
