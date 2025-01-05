import React, { Fragment, useCallback, useState } from "react";
import Slider from "@mui/material/Slider";
import { MtUiButton } from "@/components/button";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { startRandomReview } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";

const ChoiceQuestionBeforeStart = ({
    setIsStart,
}: {
    setIsStart: (e: boolean) => void;
}) => {
    const [value, setValue] = useState(0);
    const dispatch = useAppDispatch();

    const handleSliderChange = useCallback(
        (event: Event, newValue: number | number[]) => {
            setValue(newValue as number);
        },
        []
    );

    const handleStartTest = useCallback(async () => {
        let listQuestion: ICurrentGame[] = [];

        const topics = await db?.topics.toArray();
        if (topics?.length) {
            const countQuestionTopic = Math.floor(value / topics.length);

            const remainderQuestionTopic = value % topics.length;
            for (const [topicIndex, topic] of topics.entries()) {
                const listPart = topic?.topics?.flatMap((item) => item.topics);
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
                                ];
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
    }, [dispatch, value, setIsStart]);

    return (
        <Fragment>
            <div className="flex items-center justify-between gap-4 px-6 py-6">
                <p className="text-base font-medium">0</p>
                <Slider
                    defaultValue={30}
                    value={value}
                    valueLabelDisplay="auto"
                    onChange={handleSliderChange}
                    sx={{
                        height: "10px",
                        padding: "8px 0",
                        "& .MuiSlider-track": {
                            backgroundColor: "primary.main",
                            border: "none",
                            height: "10px",
                        },
                        "& .MuiSlider-thumb": {
                            backgroundColor: "white",
                            border: "1px solid var(--color-primary)",
                        },
                        "& .MuiSlider-rail": {
                            backgroundColor: "#ccc",
                            height: "10px",
                        },
                        "& .MuiSlider-valueLabel": {
                            backgroundColor: "red",
                            // MuiSlider-valueLabelLabel
                        },
                    }}
                />
                <p className="text-base font-medium">100</p>
            </div>
            <div className="w-full rounded-b-lg bg-[#7C6F5B0F] px-6 py-4 flex items-center justify-between">
                <p className="text-xl font-semibold">Questions: {value}</p>
                <MtUiButton
                    type="primary"
                    size="large"
                    className="text-white"
                    disabled={!value}
                    onClick={handleStartTest}
                >
                    Start
                </MtUiButton>
            </div>
        </Fragment>
    );
};

export default React.memo(ChoiceQuestionBeforeStart);
