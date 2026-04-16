"use client";

import { useState, useId } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ChatBar({
  onSubmit,
}: {
  onSubmit: (message: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [reply, setReply] = useState<string | null>(null);
  const honeypotId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || status === "sending") return;
    const msg = value.trim();
    setStatus("sending");
    setValue("");
    setReply("I wrote that down — you'll hear from me. Meanwhile, here's something close:");
    try {
      await onSubmit(msg);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[640px] mx-auto">
      <label htmlFor="chat" className="sr-only">Ask me something</label>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        id={honeypotId}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-0 h-0 opacity-0"
        aria-hidden="true"
      />
      <div className="flex gap-2 items-stretch bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus-within:border-[var(--color-accent)] transition-colors">
        <input
          id="chat"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="So — what brings you here?"
          className="flex-1 bg-transparent px-5 py-4 outline-none font-[var(--font-voice)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
        />
        <button
          type="submit"
          disabled={!value.trim() || status === "sending"}
          className="px-4 text-[var(--color-accent)] font-[var(--font-voice)] disabled:opacity-40"
        >
          →
        </button>
      </div>
      {reply && (
        <div className="mt-4 font-[var(--font-voice)] text-sm text-[var(--color-text-muted)]">
          {reply}{" "}
          <a href="/work" className="text-[var(--color-accent)] hover:underline">show me a case study →</a>
          {status === "sent" && <span className="ml-2 text-[var(--color-accent)]">•</span>}
        </div>
      )}
    </form>
  );
}
