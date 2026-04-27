import type { ReactNode } from "react";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { AllWorkBackLink } from "@/components/canvas/AllWorkBackLink";
import { Rail } from "@/components/landing/Rail";

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Rail />
      <div className="relative flex flex-col min-w-0">
        <div className="absolute top-0 left-0 right-0 z-20">
          <SiteHeader rightSlot={<AllWorkBackLink />} />
        </div>
        <main id="main" className="flex-1">{children}</main>
      </div>
      <CaseStudyAsk />
    </div>
  );
}
