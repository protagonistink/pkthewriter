import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-mono)] text-2xl text-[var(--color-accent)] mb-2">404</h1>
        <p className="font-[family-name:var(--font-mono)] text-[var(--color-ink-soft)] mb-6">
          That one&apos;s on the cutting room floor.
        </p>
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-sm border border-[var(--color-paper-line)] px-4 py-2 rounded-full hover:border-[var(--color-accent)] transition-colors"
        >
          ← back home
        </Link>
      </div>
    </main>
  );
}
