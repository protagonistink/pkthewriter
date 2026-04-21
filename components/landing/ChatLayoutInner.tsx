"use client";

import { usePathname } from "next/navigation";
import { HeroIntro } from "@/components/landing/HeroIntro";
import type { ReactNode } from "react";

export function ChatLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const heroMode = pathname === "/about" ? "receded" : "full";

  return (
    <div
      data-chat-route={pathname === "/about" ? "about" : "landing"}
      className="flex-1 flex flex-col justify-center -mt-[12px]"
    >
      <HeroIntro mode={heroMode} />
      {children}
    </div>
  );
}
