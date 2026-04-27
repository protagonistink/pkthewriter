"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ContactModal } from "./ContactModal";

type Props = {
  email?: string;
  /** Override the right-hand link. Case-study and takeover surfaces pass a
   *  lateral nav link (e.g. "← All work") instead of the Hire Me CTA. */
  rightSlot?: ReactNode;
};

export function SiteHeader({ email: _email, rightSlot }: Props) {
  const [contactOpen, setContactOpen] = useState(false);

  // Any CTA on the site can open the modal by dispatching this event.
  // Case-study pages and the /about Say-Hello block use it because they
  // override `rightSlot` and so wouldn't reach the in-header trigger.
  useEffect(() => {
    const handler = () => setContactOpen(true);
    document.addEventListener("open-contact-modal", handler);
    return () => document.removeEventListener("open-contact-modal", handler);
  }, []);

  return (
    <>
      <header className="flex items-start justify-between pt-[22px] px-[44px] max-[820px]:px-[28px] max-[820px]:pt-[14px] max-[768px]:pl-[72px]">
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
          <div className="flex items-center gap-[16px] pt-[6px]">
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="
                font-[family-name:var(--font-mono)] text-[12px] tracking-[0.2em] uppercase
                px-[14px] py-[8px] rounded-full
                bg-[var(--color-accent)] text-[var(--color-paper)]
                hover:opacity-85 transition-opacity
              "
            >
              Hire Me
            </button>
          </div>
        )}
      </header>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
