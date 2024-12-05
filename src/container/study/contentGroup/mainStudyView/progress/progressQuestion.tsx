import React, { useEffect, useState } from "react";
import "./progress.css";
import { useAppSelector } from "@/lib/redux/hooks";
import { gameState } from "@/lib/redux/features/game";
import { db } from "@/lib/db/db.model";
import { IUserQuestionProgress } from "@/lib/models/progress/userQuestionProgress";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
const ProgressQuestion = () => {
  const [progress, setProgress] = useState(0);
  const { currentGame, listQuestion, idTopic } = useAppSelector(gameState);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleCalculatorProgress = async () => {
      const listAnswer = await db.userProgress
        .where("parentId")
        .equals(idTopic)
        .toArray();

      const latestAnswers = listAnswer.reduce<
        Record<number, IUserQuestionProgress>
      >((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});

      const totalCorrect = Object.values(latestAnswers).filter(
        (item) => item.selectedAnswers?.correct
      );
      setProgress((totalCorrect.length / listQuestion.length) * 100);
    };
    if (idTopic !== -1 && currentGame && listQuestion.length && !isMobile)
      handleCalculatorProgress();
  }, [listQuestion, currentGame, idTopic, isMobile]);

  return (
    <div className="w-full hidden sm:block custom-header-progress">
      <progress value={progress} max={100} />
    </div>
  );
};

export default ProgressQuestion;
