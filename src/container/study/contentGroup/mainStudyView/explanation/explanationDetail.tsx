"use client";
import CrownIcon from "@/components/icon/iconCrown";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { gameState } from "@/lib/redux/features/game";
import { useAppSelector } from "@/lib/redux/hooks";
import { trackingEventGa4 } from "@/lib/services/googleEvent";
import ctx from "@/utils/mergeClass";
import { MyCrypto } from "@/utils/myCrypto";
import { MathJax } from "better-react-mathjax";
import React, { useEffect, useState } from "react";

const FN = () => {
  const isMobile = useIsMobile();
  const isProUser = false;

  const [text, setText] = useState<string>("");
  const { currentGame } = useAppSelector(gameState);

  useEffect(() => {
    if (currentGame?.text && currentGame?.id) {
      try {
        const content = MyCrypto.decrypt(currentGame?.text);
        setText(content);
      } catch (err) {
        console.log("🚀 ~ useEffect ~ err:", err);
      }
    }
  }, [currentGame?.id]);
  return (
    <div
      className={ctx(" transition-all", {
        hidden: !currentGame?.selectedAnswer,
        block: currentGame?.selectedAnswer,
      })}
      onClick={() => {
        if (!isProUser) {
          trackingEventGa4({
            eventName: "click_pro_explain",
            value: {},
          });

          window.open("/get-pro", "_blank");
        }
      }}
    >
      <div className="flex text-[#004fc2] text-sm sm:text-base gap-2 items-center">
        Detailed Explanation
        {!isProUser && (
          <div className="flex items-center gap-1">
            {!isMobile ? "(Get" : ""}
            <div className="flex gap-1 px-2 text-white text-xs py-1 rounded-2xl bg-black items-center">
              <CrownIcon />
              Pro
            </div>
            {!isMobile ? "to show this content)" : ""}
          </div>
        )}
      </div>

      <div
        className={ctx({
          "blur-content": !isProUser,
        })}
      >
        <MathJax
          style={{
            fontSize: 12,
          }}
          dynamic
          renderMode="post"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
        </MathJax>
      </div>
    </div>
  );
};
const ExplanationDetail = React.memo(FN);
export default ExplanationDetail;
