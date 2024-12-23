"use client";

import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IQuestion } from "@/models/question/questions";
import { generateRandomNegativeId } from "@/utils/math";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";

const setDataStoreDiagnostic = async ({
    listQuestion,
    belowFifty,
    aboveFifty,
    parentId,
}: {
    listQuestion: ICurrentGame[];
    parentId: number;
    aboveFifty: Record<string, ICurrentGame[]>;
    belowFifty: Record<string, ICurrentGame[]>;
}) => {
    await db?.testQuestions.add({
        parentId: parentId,
        question: listQuestion as IQuestion[],
        duration: 1,
        aboveFifty,
        belowFifty,
        isPaused: false,
        startTime: new Date().getTime(),
        remainTime: 60,
        type: "diagnosticTest",
        status: 0,
    });
};

const initDiagnosticTestQuestionThunk = createAsyncThunk(
    "initDiagnosticTest",
    async () => {
        const diagnostic = await db?.testQuestions
            .where("type")
            .equals("diagnosticTest")
            .filter((item) => item.status === 0)
            .first();
        if (!diagnostic) {
            const parentId = generateRandomNegativeId();
            const listQuestion: ICurrentGame[] = [];
            const belowFifty: Record<string, ICurrentGame[]> = {};
            const aboveFifty: Record<string, ICurrentGame[]> = {};
            const topic = await db?.topics.toArray();

            if (topic) {
                for (const subTopic of topic) {
                    const idTopic = subTopic?.topics?.[0].id;

                    if (idTopic) {
                        const ques = await db?.topicQuestion
                            .where("parentId")
                            .equals(idTopic)
                            .toArray();

                        const list = ques?.flatMap(
                            (item) => item?.questions
                        ) as IQuestion[];

                        const start = list?.find((item) => item.level === -1);

                        const randomItem = {
                            ...(start ||
                                list[Math.floor(Math.random() * list.length)]),
                            tag: subTopic.tag,
                        };

                        if (randomItem && list) {
                            const newItems: ICurrentGame[] = Array.from(
                                { length: 2 },
                                () => ({
                                    id: generateRandomNegativeId(),
                                    status: -1,
                                    text: "",
                                    level: 0,
                                    parentId: 0,
                                    syncStatus: 0,
                                    explanation: "",
                                    answers: [],
                                    localStatus: "new",
                                    selectedAnswer: null,
                                    turn: 1,
                                    tag: subTopic.tag,
                                })
                            );

                            if (randomItem && newItems) {
                                listQuestion.push(randomItem, ...newItems);
                                // level : 1

                                const belowFiftyQuestions = list.filter(
                                    (item) =>
                                        (item?.level || 0) < 50 &&
                                        item.id !== randomItem?.id
                                );
                                const randomBelowFifty = belowFiftyQuestions
                                    .sort(() => 0.5 - Math.random())
                                    .slice(0, 2);

                                // level : 3

                                const aboveFiftyQuestions = list.filter(
                                    (item) =>
                                        item?.level > 50 &&
                                        item.id !== randomItem?.id
                                );

                                const randomAboveFifty = aboveFiftyQuestions
                                    .sort(() => 0.5 - Math.random())
                                    .slice(0, 2);

                                belowFifty[subTopic.tag] = [
                                    ...(randomBelowFifty.length > 0
                                        ? randomBelowFifty
                                        : randomAboveFifty),
                                ];

                                aboveFifty[subTopic.tag] = [
                                    ...(randomAboveFifty.length > 0
                                        ? randomAboveFifty
                                        : randomBelowFifty),
                                ];
                            }
                        }
                    }
                }
            }
            setDataStoreDiagnostic({
                listQuestion,
                belowFifty,
                aboveFifty,
                parentId,
            });

            return {
                listQuestion,
                belowFifty,
                aboveFifty,
                isPaused: false,
                idTopic: parentId,
                progressData: [],
            };
        } else {
            const progressData = await getLocalUserProgress(
                diagnostic.parentId,
                "test"
            );

            if (progressData) {
                const questions = mapQuestionsWithProgress(
                    diagnostic.question,
                    progressData
                );
                console.log("kk", questions);

                return {
                    progressData: progressData,
                    listQuestion: questions,
                    belowFifty: diagnostic.belowFifty,
                    aboveFifty: diagnostic.aboveFifty,
                    isPaused: true,
                    idTopic: diagnostic.parentId,
                };
            }
        }
    }
);

export default initDiagnosticTestQuestionThunk;
