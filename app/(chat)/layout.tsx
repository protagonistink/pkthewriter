import type { ReactNode } from "react";
import { Rail } from "@/components/landing/Rail";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { ChatLayoutInner } from "@/components/landing/ChatLayoutInner";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <Rail />
      <div className="flex flex-col min-w-0">
        <SiteHeader />
        <main
          id="main"
          className="flex-1 flex flex-col mx-auto w-full max-w-[1040px] px-[60px] pt-[80px] pb-[120px] max-[820px]:px-[24px] max-[820px]:pt-[40px] max-[820px]:pb-[140px] max-[430px]:px-[16px]"
        >
          <ChatLayoutInner>{children}</ChatLayoutInner>
        </main>
      </div>
    </div>
  );
}
