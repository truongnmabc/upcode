"use client";
import MyContainer from "@/components/container";
import { db } from "@/db/db.model";
import { IAnswer } from "@/models/question/questions";
import { selectTurn } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    saveDataPassing,
    totalPassingApp,
    totalPassingPart,
    totalQuestionApp,
} from "./calculate";
import GridTopicProgress from "./gridTopic";
import PassingFinishPage from "./passing";
import ProgressFinishPage from "./progress";
import TitleFinishPage from "./title";

const FinishLayout = () => {
    const subTopicProgressId = useSearchParams().get("subTopicProgressId");
    const partId = useSearchParams().get("partId");
    const turn = useAppSelector(selectTurn);

    const [game, setGame] = useState<{
        currentPart: number;
        listAnswer: IAnswer[];
        currentPartTag: string;
        passing: number;
        nextPart: {
            subTopicTag: string;
            tag: string;
        };
        currentTurn: number;
        extraPoint: number;
    }>({
        currentPart: 0,
        listAnswer: [],
        currentPartTag: "",
        nextPart: {
            subTopicTag: "",
            tag: "",
        },
        currentTurn: 0,
        passing: 0,
        extraPoint: 0,
    });

    const handleGetData = useCallback(async () => {
        if (subTopicProgressId && turn && partId) {
            const data = await db?.subTopicProgress
                .where("id")
                .equals(Number(subTopicProgressId))
                .first();

            const partIndex =
                data?.part.findIndex((item) => item.status === 1) || 0;

            const useProgress =
                (await db?.userProgress
                    .filter((item) => item.parentIds.includes(Number(partId)))
                    .sortBy("index")) || [];

            const passingDb = await db?.passing
                .where("id")
                .equals(Number(subTopicProgressId))
                .first();

            const currentPassing = passingDb?.topics?.find(
                (item) => item.id === Number(partId)
            );
            let passingApp = 0;
            let extraPoint = 0;
            if (passingDb && currentPassing) {
                const totalPassing = await totalPassingPart(
                    useProgress,
                    currentPassing?.averageLevel
                );

                const listPass = await db?.passing.toArray();
                if (listPass) {
                    const totalQuestion = totalQuestionApp(listPass);
                    const totalQuestionTopic = listPass
                        .filter((item) => item.parentId === passingDb.parentId)
                        ?.reduce((acc, cur) => acc + cur.totalQuestion, 0);

                    extraPoint = totalPassing / totalQuestionTopic;

                    const prev = await totalPassingApp(listPass);

                    passingApp = (prev + totalPassing) / (totalQuestion || 1);

                    const listNew = passingDb.topics?.map((item) =>
                        item.id === Number(partId)
                            ? {
                                  ...item,
                                  passing: totalPassing,
                              }
                            : item
                    );

                    saveDataPassing({
                        id: Number(subTopicProgressId),
                        data: {
                            ...passingDb,
                            passing:
                                listNew?.reduce(
                                    (acc, cur) => acc + cur.passing,
                                    0
                                ) || 0,
                            topics: listNew,
                        },
                    });
                }
            }

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
                    passing: passingApp,
                    extraPoint,
                });
            }
        }
    }, [subTopicProgressId, partId, turn]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <MyContainer>
            <div className="w-full py-6 h-full gap-8 flex flex-col">
                <TitleFinishPage />
                <ProgressFinishPage listAnswer={game.listAnswer} />
                <PassingFinishPage
                    nextPart={game.nextPart}
                    currentPartTag={game.currentPartTag}
                    currentTurn={game.currentTurn}
                    passing={game.passing}
                    extraPoint={game.extraPoint}
                />
                <GridTopicProgress />
            </div>
        </MyContainer>
    );
};

export default FinishLayout;
