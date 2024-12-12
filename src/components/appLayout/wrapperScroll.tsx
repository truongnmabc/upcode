"use client";

import React, { useRef, useState } from "react";
import ScrollToTopArrow from "../scrollTop";
import { SessionProvider } from "next-auth/react";

const WrapperScroll = ({ children }: { children: React.ReactNode }) => {
  const [isScrollRef, setIsShowRef] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <SessionProvider>
      <div
        className="w-screen h-screen flex flex-col justify-between  overflow-auto"
        onScroll={(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
          const { scrollTop } = e.target as HTMLElement;

          if (scrollTop > 300 && !isScrollRef) {
            setIsShowRef(true);
          }
          if (scrollTop < 300 && isScrollRef) {
            setIsShowRef(false);
          }
        }}
        ref={scrollRef}
      >
        {children}
        {isScrollRef && <ScrollToTopArrow scrollRef={scrollRef} />}
      </div>
      //{" "}
    </SessionProvider>
  );
};
export default React.memo(WrapperScroll);
