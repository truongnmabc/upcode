import React, { useEffect, useState } from "react";
import TitleFinishPage from "./title";
import ProgressFinishPage from "./progress";
import PassingFinishPage from "./passing";
import GridTopicProgress from "./gridTopic";
import { useSearchParams } from "next/navigation";
import { db } from "@/db/db.model";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";
import { IAnswer } from "@/models/question/questions";
import { IPartProgress } from "@/models/progress/subTopicProgress";

const FinishLayout = () => {
  const subTopicProgressId = useSearchParams().get("subTopicProgressId");
  const partId = useSearchParams().get("partId");

  const { turn } = useAppSelector(gameState);

  const [game, setGame] = useState<{
    currentPart: number;
    listAnswer: IAnswer[];
    currentPartTag: string;
    nextPart: {
      subTopicTag: string;
      tag: string;
    };
  }>({
    currentPart: 0,
    listAnswer: [],
    currentPartTag: "",
    nextPart: {
      subTopicTag: "",
      tag: "",
    },
  });

  useEffect(() => {
    const handleGetData = async () => {
      if (subTopicProgressId && turn && partId) {
        const data = await db.subTopicProgress
          .where("id")
          .equals(Number(subTopicProgressId))
          .first();
        console.log("🚀 ~ handleGetData ~ data:", data);

        const partIndex =
          data?.part.findIndex((item) => item.status === 1) || 0;

        const useProgress = await db.userProgress
          .where("parentId")
          .equals(Number(partId))
          .toArray();

        const turnPlayingData = useProgress.flatMap((item) =>
          item.selectedAnswers?.find((s) => s.turn === turn)
        );

        const filteredAnswers = turnPlayingData?.filter(
          (item): item is IAnswer => item !== undefined
        );

        const nextPart = data?.part?.find((p) => p.status === 0);

        if (filteredAnswers && filteredAnswers.length && data?.id) {
          setGame({
            currentPart: partIndex + 1,
            listAnswer: filteredAnswers,
            nextPart: {
              subTopicTag: data.subTopicTag,
              tag: nextPart?.tag || "",
            },
            currentPartTag: data.part[partIndex].tag,
          });
        }
      }
    };
    handleGetData();
  }, [subTopicProgressId, partId, turn]);

  return (
    <div className="w-full py-6 h-full gap-8 flex flex-col">
      <TitleFinishPage currentPart={game.currentPart} />
      <ProgressFinishPage listAnswer={game.listAnswer} />
      <PassingFinishPage
        nextPart={game.nextPart}
        currentPartTag={game.currentPartTag}
      />
      <GridTopicProgress />
    </div>
  );
};

export default FinishLayout;
