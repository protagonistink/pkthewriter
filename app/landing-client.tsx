"use client";

import { useState } from "react";
import { ChatBar } from "@/components/landing/ChatBar";
import { PromptChips } from "@/components/landing/PromptChips";
import { PICard } from "@/components/canvas/PICard";

export function LandingClient() {
  const [piOpen, setPiOpen] = useState(false);

  async function handleMessage(message: string) {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context: "free-text" }),
    });
  }

  return (
    <>
      <ChatBar onSubmit={handleMessage} />
      <PromptChips onCardChip={() => setPiOpen(true)} />
      {piOpen && <PICard onClose={() => setPiOpen(false)} />}
    </>
  );
}
