"use client";

import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useCaseStudyTransition } from "@/lib/use-case-study-transition";

type Props = {
  href: string;
  className?: string;
  titleSelector?: string;
  children: ReactNode;
};

export function ClientCaseStudyLink({ href, className, titleSelector, children }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { navigate } = useCaseStudyTransition();

  return (
    <Link
      ref={linkRef}
      href={href}
      className={className}
      onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
        const anchorEl = linkRef.current;
        const titleEl = titleSelector
          ? anchorEl?.querySelector<HTMLElement>(titleSelector) ?? null
          : null;
        navigate(e, href, { titleEl, anchorEl });
      }}
    >
      {children}
    </Link>
  );
}
