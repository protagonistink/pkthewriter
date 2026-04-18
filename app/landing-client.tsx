"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatBar } from "@/components/landing/ChatBar";
import { ContactCard } from "@/components/landing/ContactCard";
import { HeroIntro } from "@/components/landing/HeroIntro";
import { ResponseFeature } from "@/components/landing/ResponseFeature";
import { PICard } from "@/components/canvas/PICard";
import { resolveFeature, type FeatureKey, type FeatureMap, type FeatureCard } from "@/lib/feature-resolver";

type Props = {
  featureMap: FeatureMap;
};

export function LandingClient({ featureMap }: Props) {
  const router = useRouter();
  const [piOpen, setPiOpen] = useState(false);
  const [feature, setFeature] = useState<FeatureCard | null>(null);
  const [contactCard, setContactCard] = useState<"hi" | "contact" | null>(null);
  const [autoFocus] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const params = new URL(window.location.href).searchParams;
    return (
      params.get("ask") === "1" ||
      !!params.get("q") ||
      window.location.hash === "#ask"
    );
  });
  const [initialQuery] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return new URL(window.location.href).searchParams.get("q") ?? "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const askParam = url.searchParams.get("ask") === "1";
    const qParam = url.searchParams.get("q");
    const askHash = window.location.hash === "#ask";
    if (askParam || askHash || qParam) {
      if (askParam) url.searchParams.delete("ask");
      if (qParam) url.searchParams.delete("q");
      const clean =
        url.pathname +
        (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "") +
        (askHash ? "" : window.location.hash);
      window.history.replaceState({}, "", clean);
    }
  }, []);

  async function handleLead(message: string) {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context: "free-text" }),
    });
  }

  function handleNavigate(to: string) {
    const [path, hash] = to.split("#");
    if (hash) {
      router.push(path);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else {
      router.push(to);
    }
  }

  function handleFeature(key: FeatureKey) {
    const card = resolveFeature(key, featureMap);
    setContactCard(null);
    setFeature(card);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleContactCard(variant: "hi" | "contact") {
    setFeature(null);
    setContactCard(variant);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleReset() {
    setFeature(null);
    setContactCard(null);
  }

  const inResponse = feature !== null || contactCard !== null;

  return (
    <div data-state={inResponse ? "response" : "idle"} className="flex-1 flex flex-col">
      <HeroIntro />
      <ChatBar
        onLead={handleLead}
        onNavigate={handleNavigate}
        onCard={(id) => id === "pi" && setPiOpen(true)}
        onFeature={(key) => handleFeature(key)}
        onContactCard={handleContactCard}
        inResponse={inResponse}
        onReset={handleReset}
        autoFocus={autoFocus}
        initialQuery={initialQuery}
      />
      {feature && (
        <ResponseFeature
          feature={feature}
          onAltSelect={(key) => handleFeature(key)}
        />
      )}
      {contactCard && (
        <ContactCard
          variant={contactCard}
          onLead={handleLead}
          onFallback={handleReset}
        />
      )}
      {piOpen && <PICard onClose={() => setPiOpen(false)} />}
    </div>
  );
}
