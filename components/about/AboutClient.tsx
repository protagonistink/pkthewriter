"use client";

import type { CSSProperties } from "react";
import { AboutThread } from "./AboutThread";
import openingData from "@/data/about-opening.json";
import type { Exchange } from "@/lib/about-types";

const PAGE_BG: CSSProperties = {
  background:
    "linear-gradient(180deg, var(--color-paper) 0%, var(--color-paper) 55%, #d9d1be 85%, #b8aa91 100%)",
  minHeight: "auto",
};

const openingExchanges = openingData.exchanges as Exchange[];

export function AboutClient() {
  return (
    <section
      style={PAGE_BG}
      className="relative text-[var(--color-ink)] pt-[6vh] pb-[24vh] px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[720px] mx-auto">
        <AboutThread exchanges={openingExchanges} />
      </div>
    </section>
  );
}
