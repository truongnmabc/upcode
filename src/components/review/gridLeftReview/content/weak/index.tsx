import { CustomTabPanel } from "@/components/resultTest/reviewAnswers/tabsReviewAnswer";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { startRandomReview } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { useEffect } from "react";

const WeakQuestions = () => {
    const dispatch = useAppDispatch();
    const [listTopic, setListTopic] = React.useState<IUserQuestionProgress[]>(
        []
    );
    useEffect(() => {
        const handleGetData = async () => {
            // const topics = await db?.topics.toArray();
            // let listQuestion: ICurrentGame[] = [];

            // if (topics?.length) {
            //     for (const topic of topics) {
            //         const listPart = topic?.topics?.flatMap(
            //             (item) => item.topics
            //         );

            //         if (listPart) {
            //             for (const part of listPart) {
            //                 if (part?.id) {
            //                     const topicData = await db?.topicQuestion
            //                         ?.where("id")
            //                         .equals(part.id)
            //                         .first();

            //                     if (topicData?.questions) {
            //                         const randomQuestions = topicData.questions;

            //                         listQuestion = [
            //                             ...listQuestion,
            //                             ...randomQuestions,
            //                         ];
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }

            // console.log("🚀 ~ handleGetData ~ listQuestion:", listQuestion);
            const data = await db?.userProgress.toArray();
            console.log("🚀 ~ handleGetData ~ data:", data);
            if (data) {
                const incorrect = data.filter(
                    (item) => !item.selectedAnswer?.correct
                );

                console.log("🚀 ~ handleGetData ~ incorrect:", incorrect);

                setListTopic(incorrect);
                dispatch(
                    startRandomReview({
                        listQuestion: incorrect,
                    })
                );
            }
        };
        handleGetData();
    }, []);
    return (
        <div>
            <p className="text-2xl text-center font-semibold">
                Review your answers
            </p>
            <div className="my-4 h-full w-full">
                <MathJaxContext>
                    <CustomTabPanel value={0} index={0} data={listTopic} />
                </MathJaxContext>
            </div>
        </div>
    );
};

export default WeakQuestions;
