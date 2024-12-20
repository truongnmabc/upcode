"use client";

import { db } from "@/db/db.model";
import { IQuestion } from "@/models/question/questions";
import { ICurrentGame } from "@/redux/features/game";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initDiagnosticTestQuestionThunk = createAsyncThunk(
    "initDiagnosticTest",
    async () => {
        const topic = await db?.topics.toArray();

        let listQuestion: ICurrentGame[] = [];
        let belowFifty: ICurrentGame[] = [];
        let aboveFifty: ICurrentGame[] = [];

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

                    const randomItem = {
                        ...list[Math.floor(Math.random() * list.length)],
                        tag: subTopic.tag,
                    };

                    if (randomItem && list) {
                        const newItems: ICurrentGame[] = Array.from(
                            { length: 2 },
                            () => ({
                                id: -1,
                                status: -1,
                                text: "",
                                level: 0,
                                parentId: 0,
                                syncStatus: 0,
                                explanation: "",
                                answers: [],
                                localStatus: undefined,
                                selectedAnswer: null,
                                turn: undefined,
                                tag: subTopic.tag,
                            })
                        );

                        if (randomItem && newItems) {
                            listQuestion.push(randomItem, ...newItems);

                            const belowFiftyQuestions = list.filter(
                                (item) => (item?.level || 0) < 50
                            );

                            const randomBelowFifty = belowFiftyQuestions
                                .sort(() => 0.5 - Math.random())
                                .slice(0, 2);

                            const aboveFiftyQuestions = list.filter(
                                (item) => item?.level > 50
                            );

                            const randomAboveFifty = aboveFiftyQuestions
                                .sort(() => 0.5 - Math.random())
                                .slice(0, 2);

                            if (randomBelowFifty) {
                                belowFifty.push(...randomBelowFifty);
                            }

                            if (randomBelowFifty) {
                                aboveFifty.push(...randomAboveFifty);
                            }
                        }
                    }
                }
            }
        }

        return {
            listQuestion,
            belowFifty,
            aboveFifty,
        };
    }
);

export default initDiagnosticTestQuestionThunk;
