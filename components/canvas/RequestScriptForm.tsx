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
        className="font-[family-name:var(--font-mono)] text-sm border border-[var(--color-paper-line)] text-[var(--color-ink)] px-3 py-1.5 rounded-full hover:border-[var(--color-ink)] transition-colors"
      >
        request full script →
      </button>
    );
  }

  if (status === "sent") {
    return <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-ink-soft)]">thanks — you&apos;ll hear from me.</span>;
  }

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input
        type="email"
        required
        placeholder="your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-[family-name:var(--font-mono)] text-sm border border-[var(--color-paper-line)] bg-transparent px-3 py-1.5 rounded-full outline-none focus:border-[var(--color-ink)]"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="font-[family-name:var(--font-mono)] text-sm border border-[var(--color-ink)] px-3 py-1.5 rounded-full hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors disabled:opacity-50"
      >
        send →
      </button>
    </form>
  );
}
