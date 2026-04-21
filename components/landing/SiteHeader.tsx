import Link from "next/link";
import type { ReactNode } from "react";

const FALLBACK_EMAIL = "patrick@pkthewriter.com";

type Props = {
  email?: string;
  /** Override the right-hand link. Case-study and takeover surfaces pass a
   *  lateral nav link (e.g. "← All work") instead of the Contact mailto. */
  rightSlot?: ReactNode;
};

export function SiteHeader({ email, rightSlot }: Props) {
  const mailto = `mailto:${email ?? FALLBACK_EMAIL}`;
  return (
    <header className="flex items-start justify-between pt-[22px] px-[44px] max-[820px]:px-[28px] max-[820px]:pt-[14px]">
      <Link href="/" aria-label="Patrick Kirkland — Home" className="inline-block w-[200px]">
        <img
          src="/logo-signature.png"
          alt="Patrick Kirkland, writer"
          className="site-logo site-logo--paper w-full h-auto"
        />
        <img
          src="/logo_white_trans.png"
          alt=""
          aria-hidden="true"
          className="site-logo site-logo--dark w-full h-auto"
        />
      </Link>
      {rightSlot ?? (
        <a
          href={mailto}
          className="
            inline-block pt-[10px]
            font-[family-name:var(--font-mono)] text-[12px] tracking-[0.2em] uppercase
            text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] hover:tracking-[0.24em]
            transition-[color,letter-spacing] duration-[320ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
          "
        >
          Contact
        </a>
      )}
    </header>
  );
}
