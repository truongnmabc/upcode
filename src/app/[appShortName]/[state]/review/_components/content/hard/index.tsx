import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { startRandomReview } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import { Fragment, useState } from "react";
import ChoiceQuestionBeforeStart from "../random/choiceQuestionBeforeStart";

const HardQuestions = ({ isMobile }: { isMobile: boolean }) => {
    const [isStart, setIsStart] = useState(false);

    const dispatch = useAppDispatch();

    const handleStartTest = async (value: number) => {
        setIsStart(true);
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
                                        .filter(
                                            (item) =>
                                                item.level === -1 ||
                                                item.level > 50
                                        )
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
                listQuestion: listQuestion?.map((item) => ({
                    ...item,
                    localStatus: "new" as const,
                })),
            })
        );
    };

    return (
        <div
            className="w-full rounded-lg bg-white "
            style={{
                boxShadow: "0px 2px 4px 0px #2121211F",
            }}
        >
            {isStart ? (
                <MathJaxContext>
                    <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                        <div className="sm:p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-center ">
                                <h3 className="text-xl font-semibold ">
                                    Hard Questions
                                </h3>
                            </div>
                            <ProgressQuestion />
                            <QuestionContent />
                            <ChoicesPanel />
                            <ExplanationDetail />
                        </div>

                        <BottomActions type="learn" isShow />
                    </div>
                </MathJaxContext>
            ) : (
                <Fragment>
                    {!isMobile && (
                        <ChoiceQuestionBeforeStart
                            handleStartTest={handleStartTest}
                        />
                    )}
                </Fragment>
            )}
        </div>
    );
};

export default HardQuestions;
