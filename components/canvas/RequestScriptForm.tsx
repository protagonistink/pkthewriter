"use client";

import { useState } from "react";

export function RequestScriptForm({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "screenplay-request",
          message: `Script request: "${title}" from ${email}`,
        }),
      });
      if (!r.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-voice text-sm border border-[var(--color-paper-border)] text-[var(--color-paper-text)] px-3 py-1.5 rounded-full hover:border-[var(--color-paper-text)] transition-colors"
      >
        request full script →
      </button>
    );
  }

  if (status === "sent") {
    return <span className="font-voice text-sm text-[var(--color-paper-text-muted)]">thanks — you&apos;ll hear from me.</span>;
  }

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input
        type="email"
        required
        placeholder="your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-voice text-sm border border-[var(--color-paper-border)] bg-transparent px-3 py-1.5 rounded-full outline-none focus:border-[var(--color-paper-text)]"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="font-voice text-sm border border-[var(--color-paper-text)] px-3 py-1.5 rounded-full hover:bg-[var(--color-paper-text)] hover:text-[var(--color-paper)] transition-colors disabled:opacity-50"
      >
        send →
      </button>
    </form>
  );
}
