"use client";
import MyContainer from "@/components/container";
import { db } from "@/db/db.model";
import { IPassingModel } from "@/models/passing/passingModel";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IAnswer } from "@/models/question/questions";
import { selectTurn } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
                    .where("parentId")
                    .equals(Number(partId))
                    .sortBy("index")) || [];

            const passingDb = await db?.passing
                .where("id")
                .equals(Number(subTopicProgressId))
                .first();
            console.log("🚀 ~ handleGetData ~ passingDb:", passingDb);

            const currentPassing = passingDb?.topics?.find(
                (item) => item.id === Number(partId)
            );
            let passingApp = 0;
            let extraPoint = 0;

            const listPass = await db?.passing.toArray();

            const currentPass = listPass?.filter(
                (item) => item.parentId === Number(partId)
            );
            console.log("🚀 ~ handleGetData ~ currentPass:", currentPass);
            console.log("🚀 ~ handleGetData ~ listPass:", listPass);
            if (passingDb && currentPassing) {
                const passing = handleCalculate(
                    useProgress,
                    currentPassing?.averageLevel
                );

                console.log("🚀 ~ handleGetData ~ passing:", passing);

                extraPoint = await handleAddData(
                    passingDb,
                    passing,
                    Number(partId)
                );
                passingApp = await handlePassingApp();
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

const handleCalculate = (
    userProgress: IUserQuestionProgress[],
    averageLevel: number
) => {
    const passing = userProgress.reduce((acc, cur) => {
        if (cur?.selectedAnswers?.length) {
            const lastThreeElements = cur?.selectedAnswers.slice(-3);

            const passAnswerCount = lastThreeElements.filter(
                (item) => item.correct
            ).length;

            const passingProbability = passAnswerCount / 3;

            const level =
                ((cur.level === -1 ? 50 : cur.level) / averageLevel) * 100;

            const passing = passingProbability * level;

            return acc + passing;
        } else {
            return acc + 0;
        }
    }, 0);

    return passing / userProgress.length;
};

const handleAddData = async (
    passingDb: IPassingModel,
    calculatedPassing: number,
    partId: number
) => {
    if (passingDb) {
        const totalPassing =
            passingDb.topics?.reduce(
                (sum, topic) =>
                    sum +
                    (topic.id === partId ? calculatedPassing : topic.passing),
                0
            ) || 0;
        const passing = totalPassing / passingDb.totalQuestion;
        console.log("🚀 ~ totalPassing:", totalPassing);
        await db?.passing.update(passingDb.id, {
            passing: passing,
            topics: passingDb.topics?.map((topic) => ({
                ...topic,
                passing:
                    topic.id === partId ? calculatedPassing : topic.passing,
            })),
        });

        return passing;
    }
    return 0;
};

const handlePassingApp = async () => {
    return 0;
};
