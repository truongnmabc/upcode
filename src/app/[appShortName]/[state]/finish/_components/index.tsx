"use client";
import MyContainer from "@/components/container";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { selectAttemptNumber } from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { totalPassingPart } from "./calculate";
import GridTopicProgress from "./gridTopic";
import PassingFinishPage from "./passing";
import ProgressFinishPage from "./progress";
import TitleFinishPage from "./title";
import { IQuestionBase } from "@/models/question";

const getCurrentProgressData = async ({
    partId,
    topicName,
}: {
    partId: string;
    topicName: string;
}) => {
    const [progress, questions, currentTopic] = await Promise.all([
        db?.userProgress.where("parentId").equals(Number(partId)).toArray(),
        db?.questions.where("partId").equals(Number(partId)).toArray(),
        db?.topics.where("slug").equals(topicName).first(),
    ]);

    return { progress, questions, currentTopic };
};

const calculateProgress = (
    progress: IUserQuestionProgress[],
    questions: IQuestionBase[],
    turn: number
) => {
    return {
        correct:
            progress?.filter((item) =>
                item.selectedAnswers.some((i) => i.correct && i.turn === turn)
            ).length || 0,
        total: questions?.length || 1,
    };
};

const findNextPart = async ({
    currentTopic,
    currentSubTopic,
}: {
    currentTopic: ITopicBase;
    currentSubTopic?: ITopicBase;
}) => {
    if (!currentTopic || !currentSubTopic) return { nextPart: null, index: -1 };

    // Tìm part chưa hoàn thành trong subtopic hiện tại
    const nextPartIndex = currentSubTopic.topics.findIndex(
        (p) => p.status === 0
    );
    if (nextPartIndex !== -1) {
        return {
            nextPart: currentSubTopic.topics[nextPartIndex],
            index: nextPartIndex,
        };
    }

    // Nếu tất cả part của subtopic đã hoàn thành, tìm subtopic khác chưa hoàn thành
    const nextSubTopic = currentTopic.topics.find((sub) => sub.status === 0);
    if (nextSubTopic) {
        const nextPartIndex = nextSubTopic.topics.findIndex(
            (p) => p.status === 0
        );
        if (nextPartIndex !== -1) {
            return {
                nextPart: nextSubTopic.topics[nextPartIndex],
                index: nextPartIndex,
            };
        }
    }

    // Nếu tất cả subtopic đã hoàn thành, tìm topic tiếp theo trong danh sách topic
    const nextTopic = await db?.topics
        .filter((topic) => topic.status === 0)
        .first();
    if (nextTopic) {
        const nextSubTopic = nextTopic.topics.find((sub) => sub.status === 0);
        if (nextSubTopic) {
            const nextPartIndex = nextSubTopic.topics.findIndex(
                (p) => p.status === 0
            );
            if (nextPartIndex !== -1) {
                return {
                    nextPart: nextSubTopic.topics[nextPartIndex],
                    index: nextPartIndex,
                };
            }
        }
    }

    // Nếu không tìm thấy part nào, trả về null
    return { nextPart: null, index: -1 };
};

const calculateProgressPassing = async ({
    progress,
    averageLevel,
    turn,
}: {
    progress: IUserQuestionProgress[];
    averageLevel: number;
    turn: number;
}) => {
    const passingPart = await totalPassingPart({
        progress,
        averageLevel,
        turn,
    });

    const passingAppInfo = await db?.passingApp.get(-1);

    if (passingAppInfo) {
        return {
            extraPoint: (passingPart / passingAppInfo.totalQuestion) * 100,
        };
    }
    return {
        extraPoint: 0,
    };
};

const FinishLayout = () => {
    const subTopicId = useSearchParams()?.get("subTopicId");
    const partId = useSearchParams()?.get("partId");
    const topicName = useSearchParams()?.get("topic") || "";
    const turn = useAppSelector(selectAttemptNumber);

    const [game, setGame] = useState<{
        currentPart: ITopicBase | null;
        nextPart: ITopicBase | null;
        currentTurn: number;
        extraPoint: number;
        total: number;
        correct: number;
        currentTopicId: number;
        indexSubTopic: number;
    }>({
        currentPart: null,
        currentTopicId: 0,
        nextPart: null,
        currentTurn: 0,
        extraPoint: 0,
        total: 1,
        correct: 0,
        indexSubTopic: 1,
    });

    const handleGetData = useCallback(async () => {
        if (!subTopicId || !partId || !turn) return;

        const { currentTopic, progress, questions } =
            await getCurrentProgressData({ partId, topicName });

        if (!currentTopic || !progress || !questions) return;

        const { correct, total } = calculateProgress(progress, questions, turn);

        const currentSubTopic = currentTopic.topics.find(
            (t) => t.id === Number(subTopicId)
        );

        const currentPart =
            currentSubTopic?.topics.find((p) => p.id === Number(partId)) ||
            null;

        const { nextPart, index } = await findNextPart({
            currentTopic,
            currentSubTopic,
        });

        const { extraPoint } = await calculateProgressPassing({
            progress,
            averageLevel: currentTopic.averageLevel,
            turn,
        });
        setGame({
            currentPart,
            currentTopicId: currentTopic.id,
            nextPart,
            correct,
            total,
            currentTurn: currentPart?.turn || 1,
            extraPoint,
            indexSubTopic: index,
        });
    }, [subTopicId, partId, turn, topicName]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <MyContainer>
            <div className="w-full py-6 h-full gap-8 flex flex-col">
                <TitleFinishPage />
                <ProgressFinishPage correct={game.correct} total={game.total} />
                <PassingFinishPage {...game} />
                <GridTopicProgress />
            </div>
        </MyContainer>
    );
};

export default React.memo(FinishLayout);
