"use client";

export function PICard({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md mx-auto p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center"
      >
        <p className="font-[var(--font-voice)] text-[var(--color-text)] mb-6">
          Looking for a team instead of just me?
          <br />
          That&apos;s Protagonist Ink.
        </p>
        <a
          href="https://www.protagonist.ink"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-[var(--font-voice)] text-sm text-[var(--color-accent)] border border-[var(--color-accent)] px-4 py-2 rounded-full hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors"
        >
          open protagonist.ink →
        </a>
      </div>
    </div>
  );
}
