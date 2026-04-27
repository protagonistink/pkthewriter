"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function ChatLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      data-chat-route={pathname === "/about" ? "about" : "landing"}
      className="flex-1 flex flex-col justify-center -mt-[12px]"
    >
      {children}
    </div>
  );
}
