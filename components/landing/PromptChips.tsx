"use client";

import Link from "next/link";
import { CHIPS } from "@/lib/chips";

export function PromptChips({ onCardChip }: { onCardChip?: (id: "pi") => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-[640px] mx-auto mt-4">
      {CHIPS.map((chip) => {
        if (chip.kind === "card") {
          return (
            <button
              key={chip.id}
              onClick={() => onCardChip?.("pi")}
              className="font-[var(--font-voice)] text-sm px-4 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
            >
              {chip.label}
            </button>
          );
        }
        return (
          <Link
            key={chip.id}
            href={chip.href!}
            className="font-[var(--font-voice)] text-sm px-4 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
