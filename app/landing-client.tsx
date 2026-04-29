"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChatBar } from "@/components/landing/ChatBar";
import { ContactCard } from "@/components/landing/ContactCard";
import { HeroIntro } from "@/components/landing/HeroIntro";
import { ResponseFeature } from "@/components/landing/ResponseFeature";
import { PICard } from "@/components/canvas/PICard";
import { AboutClient } from "@/components/about/AboutClient";
import { ABOUT_FOLLOWUPS, resolveAboutFollowup, type AboutFollowup } from "@/lib/about-response";
import { resolveFeature, type FeatureKey, type FeatureMap, type FeatureCard } from "@/lib/feature-resolver";

const ABOUT_ANSWER_LIMIT = 5;

type Props = {
  featureMap: FeatureMap;
  initialAbout?: boolean;
};

type UrlIntent = { autoFocus: boolean; initialQuery: string };
const URL_INTENT_SERVER: UrlIntent = { autoFocus: false, initialQuery: "" };
// Cache so useSyncExternalStore gets a stable reference across renders.
let urlIntentCache: UrlIntent | null = null;
function subscribeNever(): () => void { return () => {}; }
function getUrlIntentSnapshot(): UrlIntent {
  if (urlIntentCache) return urlIntentCache;
  const url = new URL(window.location.href);
  const askParam = url.searchParams.get("ask") === "1";
  const qParam = url.searchParams.get("q");
  const askHash = window.location.hash === "#ask";
  urlIntentCache = {
    autoFocus: askParam || !!qParam || askHash,
    initialQuery: qParam ?? "",
  };
  return urlIntentCache;
}
function getUrlIntentServer(): UrlIntent { return URL_INTENT_SERVER; }

export function LandingClient({ featureMap, initialAbout }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [piOpen, setPiOpen] = useState(false);
  const [feature, setFeature] = useState<FeatureCard | null>(null);
  const [featureQuery, setFeatureQuery] = useState("");
  const [aboutTurns, setAboutTurns] = useState<AboutFollowup[]>([]);
  const [contactCard, setContactCard] = useState<"hi" | "contact" | null>(null);
  const [showAbout, setShowAbout] = useState(!!initialAbout);
  // Read URL-driven intent (?ask=1, ?q=…, #ask) on the client without a
  // SSR/CSR divergence: server renders defaults, client subscribes once and
  // delivers the actual values post-hydration. Cached so renders are stable.
  const { autoFocus, initialQuery } = useSyncExternalStore(
    subscribeNever,
    getUrlIntentSnapshot,
    getUrlIntentServer,
  );

  useEffect(() => {
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

  function handleFeature(key: FeatureKey, raw = "", opts: { preserveScroll?: boolean } = {}) {
    const card = resolveFeature(key, featureMap);
    setContactCard(null);
    setFeatureQuery(raw);
    setAboutTurns([]);
    setFeature(card);
    if (!opts.preserveScroll && typeof window !== "undefined") {
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
    setFeatureQuery("");
    setAboutTurns([]);
    setContactCard(null);
    setShowAbout(false);
  }

  function handleAboutFollowup(followup: AboutFollowup) {
    setAboutTurns((current) => {
      if (
        current.length >= ABOUT_ANSWER_LIMIT - 1 ||
        current.some((turn) => turn.id === followup.id)
      ) {
        return current;
      }
      return [...current, followup];
    });
  }

  function handleContextMessage(message: string) {
    if (feature?.key !== "about") return false;
    if (
      aboutTurns.length >= ABOUT_ANSWER_LIMIT - 1 ||
      aboutTurns.some((turn) => turn.id === "full-about")
    ) {
      router.push("/about");
      return true;
    }
    const remaining = ABOUT_FOLLOWUPS.filter(
      (item) => !aboutTurns.some((turn) => turn.id === item.id)
    );
    handleAboutFollowup(resolveAboutFollowup(message, remaining));
    return true;
  }

  const inResponse = feature !== null || contactCard !== null || showAbout;
  const isAboutConversation = feature?.key === "about";
  const isPinnedConversation = isAboutConversation || feature?.key === "resume";
  const heroMode = inResponse || pathname === "/about" ? "receded" : "full";

  return (
    <div
      data-state={inResponse ? "response" : "idle"}
      data-response-kind={isPinnedConversation ? "pinned" : "default"}
      className="contents"
    >
      <HeroIntro mode={heroMode} />
      {!showAbout && (
        <ChatBar
          onLead={handleLead}
          onNavigate={handleNavigate}
          onCard={(id) => id === "pi" && setPiOpen(true)}
          onFeature={(key, raw) => handleFeature(key, raw)}
          onContactCard={handleContactCard}
          onContextMessage={handleContextMessage}
          inResponse={inResponse}
          followupMode={isAboutConversation}
          onReset={handleReset}
          autoFocus={autoFocus}
          initialQuery={initialQuery}
        />
      )}
      {feature && (
        <ResponseFeature
          feature={feature}
          rawQuery={featureQuery}
          aboutTurns={aboutTurns}
          onAboutFollowup={handleAboutFollowup}
          onAltSelect={(key) => handleFeature(key, "", { preserveScroll: true })}
          onClose={handleReset}
        />
      )}
      {contactCard && (
        <ContactCard
          variant={contactCard}
          onLead={handleLead}
          onFallback={handleReset}
        />
      )}
      {showAbout && <AboutClient />}
      {piOpen && <PICard onClose={() => setPiOpen(false)} />}
    </div>
  );
}
