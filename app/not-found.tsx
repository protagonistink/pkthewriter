import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-voice text-2xl text-[var(--color-accent)] mb-2">404</h1>
        <p className="font-voice text-[var(--color-text-muted)] mb-6">
          That one&apos;s on the cutting room floor.
        </p>
        <Link
          href="/"
          className="font-voice text-sm border border-[var(--color-border)] px-4 py-2 rounded-full hover:border-[var(--color-accent)] transition-colors"
        >
          ← back home
        </Link>
      </div>
    </main>
  );
}
