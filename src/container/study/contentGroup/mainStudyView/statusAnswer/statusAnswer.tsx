import InfoIcon from "@/components/icon/InfoIcon";
import { db } from "@/lib/db/db.model";
import { gameState } from "@/lib/redux/features/game";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  CancelRounded,
  CheckCircleRounded,
  ErrorRounded,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";

type IStatus = "incorrect" | "correct" | "learning" | "review" | "new";

const StatusAnswer = () => {
  const [statusQuestion, setStatusQuestion] = useState<IStatus>("new");

  const { currentGame } = useAppSelector(gameState);

  useEffect(() => {
    const handleCheckStatusQuestion = async () => {
      const answer = await db.userProgress
        .where("id")
        .equals(currentGame.id)
        .toArray();

      setStatusQuestion(
        answer.length === 0
          ? "new"
          : answer.length === 1 && answer?.[0].selectedAnswers?.correct
          ? "correct"
          : answer.length === 1 && !answer?.[0].selectedAnswers?.correct
          ? "incorrect"
          : "learning"
      );
    };
    if (currentGame?.id) handleCheckStatusQuestion();
  }, [currentGame]);

  if (statusQuestion === "incorrect") {
    return (
      <div className="flex text-sm sm:text-base transition-all gap-2">
        <div className="w-6 h-6">
          <CancelRounded htmlColor="#fb7072" />
        </div>
        <span>
          <div className="text-[#FF746D]">INCORRECT</div>
          <span className="text-[#FF746D]">
            You will see this question soon
          </span>
        </span>
      </div>
    );
  }
  if (statusQuestion === "correct") {
    return (
      <div className="flex text-sm sm:text-base transition-all gap-2">
        <div className="w-6 h-6">
          <CheckCircleRounded htmlColor="#00c17c" />
        </div>
        <span>
          <div className="text-[#00c17c]">CORRECT</div>
          <span className="text-[#00c17c]">
            You will not see this question for a while
          </span>
        </span>
      </div>
    );
  }

  if (statusQuestion === "learning") {
    return (
      <div className="flex text-sm sm:text-base transition-all gap-2">
        <div className="w-6 h-6">
          <ErrorRounded htmlColor="#E3A651" />
        </div>
        <span>
          <div className="text-[#E3A651]">LEARNING</div>
          <span className="text-[#E3A651]">
            You got this question wrong last time
          </span>
        </span>
      </div>
    );
  }

  if (statusQuestion === "new") {
    return (
      <div className="flex text-sm sm:text-base transition-all gap-2">
        <div className="w-6 h-6">
          <InfoIcon htmlColor="#6BA6FF" />
        </div>
        <span>
          <div className="text-[#6BA6FF]">NEW QUESTION</div>
        </span>
      </div>
    );
  }

  if (statusQuestion === "review")
    return (
      <div className="flex transition-all text-sm sm:text-base gap-2">
        <div className="w-6 h-6">
          <CheckCircleRounded htmlColor="#00c17c" />
        </div>
        <span>
          <div className="text-[#00c17c]">REVIEWING</div>
          <span className="text-[#00c17c]">
            You got this question last time
          </span>
        </span>
      </div>
    );
};

export default React.memo(StatusAnswer);
