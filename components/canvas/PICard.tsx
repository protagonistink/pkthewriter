"use client";

export function PICard({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md mx-auto p-8 bg-[var(--color-paper-panel)] border border-[var(--color-paper-line)] rounded-xl text-center"
      >
        <p className="font-[family-name:var(--font-mono)] text-[var(--color-ink)] mb-6">
          Looking for a team instead of just me?
          <br />
          That&apos;s Protagonist Ink.
        </p>
        <a
          href="https://www.protagonist.ink"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)] border border-[var(--color-accent)] px-4 py-2 rounded-full hover:bg-[var(--color-accent)] hover:text-[var(--color-paper)] transition-colors"
        >
          open protagonist.ink →
        </a>
      </div>
    </div>
  );
}
