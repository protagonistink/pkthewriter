import Link from "next/link";

const FALLBACK_EMAIL = "patrick@pkthewriter.com";

export function SiteHeader({ email }: { email?: string }) {
  const mailto = `mailto:${email ?? FALLBACK_EMAIL}`;
  return (
    <header className="flex items-start justify-between pt-[22px] px-[44px] max-[820px]:px-[28px] max-[820px]:pt-[18px]">
      <Link href="/" aria-label="Patrick Kirkland — Home" className="inline-block w-[200px]">
        <img
          src="/logo-signature.png"
          alt="Patrick Kirkland, writer"
          className="w-full h-auto"
          style={{ mixBlendMode: "multiply" }}
        />
      </Link>
      <a
        href={mailto}
        className="
          inline-block pt-[10px]
          font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] uppercase
          text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] transition-colors
        "
      >
        Contact
      </a>
    </header>
  );
}
