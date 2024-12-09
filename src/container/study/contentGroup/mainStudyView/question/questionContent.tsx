"use client";
import MtUiSkeleton from "@/components/loading-skeleton";
import { gameState } from "@/lib/redux/features/game";
import { useAppSelector } from "@/lib/redux/hooks";
import { MyCrypto } from "@/utils/myCrypto";
import React, { useEffect, useState } from "react";

import { MathJax } from "better-react-mathjax";
import StatusAnswer from "../statusAnswer/statusAnswer";

const FN = () => {
  const { currentGame } = useAppSelector(gameState);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentGame && currentGame.text && currentGame.id) {
      try {
        const content = MyCrypto.decrypt(currentGame?.text);
        setText(content);
      } catch (err) {
        console.log("🚀 ~ useEffect ~ err:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [currentGame?.id]);

  return (
    <div className="w-full rounded-md p-3 flex flex-col gap-2 bg-white sm:bg-transparent  shadow-custom sm:shadow-none relative py-2">
      {loading && !text ? (
        <MtUiSkeleton className="min-h-8" />
      ) : (
        <MathJax renderMode="post">
          <span
            dangerouslySetInnerHTML={{
              __html: text,
            }}
            className="text-sm font-normal sm:text-base"
          />
        </MathJax>
      )}

      <StatusAnswer />
    </div>
  );
};

const QuestionContent = React.memo(FN);
export default QuestionContent;
