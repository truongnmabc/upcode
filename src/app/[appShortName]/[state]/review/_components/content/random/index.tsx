"use client";

import React, { useCallback, useState } from "react";
import ChoiceQuestionBeforeStart from "./choiceQuestionBeforeStart";
import RandomGameContent from "./randomGameContent";
import { useAppDispatch } from "@/redux/hooks";
import { ICurrentGame } from "@/models/game/game";
import { db } from "@/db/db.model";
import { startRandomReview } from "@/redux/features/game";

const RandomQuestions = () => {
    const [isStart, setIsStart] = useState(false);
    const dispatch = useAppDispatch();

    const handleStartTest = useCallback(
        async (value: number) => {
            let listQuestion: ICurrentGame[] = [];

            const topics = await db?.topics.toArray();
            if (topics?.length) {
                const countQuestionTopic = Math.floor(value / topics.length);

                const remainderQuestionTopic = value % topics.length;
                for (const [topicIndex, topic] of topics.entries()) {
                    const listPart = topic?.topics?.flatMap(
                        (item) => item.topics
                    );
                    if (listPart) {
                        const countQuestionPart = Math.floor(
                            countQuestionTopic / listPart.length
                        );
                        const remainderQuestionPart =
                            countQuestionTopic % listPart.length;

                        for (const [partIndex, part] of listPart.entries()) {
                            if (part?.id) {
                                const topicData = await db?.topicQuestion
                                    ?.where("id")
                                    .equals(part.id)
                                    .first();

                                if (topicData?.questions) {
                                    const questionCount =
                                        partIndex === listPart.length - 1
                                            ? countQuestionPart +
                                              remainderQuestionPart
                                            : countQuestionPart;

                                    const randomQuestions = topicData.questions
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, questionCount);

                                    listQuestion = [
                                        ...listQuestion,
                                        ...randomQuestions,
                                    ]?.map((item) => ({
                                        ...item,
                                        localStatus: "new" as const,
                                    }));
                                }
                            }
                        }

                        if (
                            topicIndex === topics.length - 1 &&
                            remainderQuestionTopic > 0
                        ) {
                            const id = listPart[listPart.length - 1]?.id;
                            if (id) {
                                const extraQuestions = await db?.topicQuestion
                                    ?.where("id")
                                    .equals(id)
                                    .first();

                                if (extraQuestions?.questions) {
                                    const extraRandomQuestions =
                                        extraQuestions.questions

                                            .sort(() => Math.random() - 0.5)
                                            .slice(0, remainderQuestionTopic);

                                    listQuestion = [
                                        ...listQuestion,
                                        ...extraRandomQuestions,
                                    ];
                                }
                            }
                        }
                    }
                }
            }

            dispatch(
                startRandomReview({
                    listQuestion: listQuestion,
                })
            );
            setIsStart(true);
        },
        [dispatch, setIsStart]
    );
    return (
        <div
            className="w-full rounded-lg bg-white "
            style={{
                boxShadow: "0px 2px 4px 0px #2121211F",
            }}
        >
            {isStart ? (
                <RandomGameContent />
            ) : (
                <ChoiceQuestionBeforeStart handleStartTest={handleStartTest} />
            )}
        </div>
    );
};

export default React.memo(RandomQuestions);
