"use client";
import { db } from "@/db/db.model";
import { IAnswer } from "@/models/question/questions";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GridTopicProgress from "./gridTopic";
import PassingFinishPage from "./passing";
import ProgressFinishPage from "./progress";
import TitleFinishPage from "./title";
import { selectTurn } from "@/redux/features/game.reselect";
import MyContainer from "@/components/container";

const FinishLayout = () => {
    const subTopicProgressId = useSearchParams().get("subTopicProgressId");
    const partId = useSearchParams().get("partId");

    const turn = useAppSelector(selectTurn);

    const [game, setGame] = useState<{
        currentPart: number;
        listAnswer: IAnswer[];
        currentPartTag: string;
        nextPart: {
            subTopicTag: string;
            tag: string;
        };
        currentTurn: number;
    }>({
        currentPart: 0,
        listAnswer: [],
        currentPartTag: "",
        nextPart: {
            subTopicTag: "",
            tag: "",
        },
        currentTurn: 0,
    });

    useEffect(() => {
        const handleGetData = async () => {
            if (subTopicProgressId && turn && partId) {
                const data = await db?.subTopicProgress
                    .where("id")
                    .equals(Number(subTopicProgressId))
                    .first();

                const partIndex =
                    data?.part.findIndex((item) => item.status === 1) || 0;

                const useProgress =
                    (await db?.userProgress
                        .where("parentId")
                        .equals(Number(partId))
                        .sortBy("index")) || [];

                const maxTurn = useProgress.reduce((max, item) => {
                    const turns = item.selectedAnswers
                        ?.map((s) => s.turn)
                        .filter((item) => item !== undefined);
                    return Math.max(max, ...(turns || []));
                }, 0);

                const filteredAnswers = useProgress
                    .flatMap((item) =>
                        item.selectedAnswers?.find((s) => s.turn === turn)
                    )
                    .filter((item): item is IAnswer => item !== undefined);

                const nextPart = data?.part?.find((p) => p.status === 0);

                if (filteredAnswers && filteredAnswers.length && data?.id) {
                    setGame({
                        currentPart: partIndex + 1,
                        listAnswer: filteredAnswers,
                        nextPart: {
                            subTopicTag: data.subTopicTag,
                            tag: nextPart?.tag || "",
                        },
                        currentPartTag:
                            data.part.find((item) => item.id === Number(partId))
                                ?.tag || "",
                        currentTurn: maxTurn,
                    });
                }
            }
        };
        handleGetData();
    }, [subTopicProgressId, partId, turn]);

    return (
        <MyContainer>
            <div className="w-full py-6 h-full gap-8 flex flex-col">
                <TitleFinishPage />
                <ProgressFinishPage listAnswer={game.listAnswer} />
                <PassingFinishPage
                    nextPart={game.nextPart}
                    currentPartTag={game.currentPartTag}
                    currentTurn={game.currentTurn}
                />
                <GridTopicProgress />
            </div>
        </MyContainer>
    );
};

export default FinishLayout;
