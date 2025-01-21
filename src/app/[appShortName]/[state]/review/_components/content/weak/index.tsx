import Empty from "@/components/empty";
import VariableSizeList from "@/components/infinite";
import QuestionResult from "@/components/questionReview";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { setListQuestionGames } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { useCallback, useEffect } from "react";

const WeakQuestions = () => {
    const [listTopic, setListTopic] = React.useState<IUserQuestionProgress[]>(
        []
    );
    const dispatch = useAppDispatch();
    const handleGetData = useCallback(async () => {
        const [data, topics] = await Promise.all([
            db?.userProgress.toArray(),
            db?.topics.toArray(),
        ]);

        if (data?.length && topics?.length) {
            const listSub = topics
                ?.flatMap((mainTopic) =>
                    mainTopic.topics?.flatMap((subTopic) =>
                        subTopic.topics?.map((topic) => ({
                            ...topic,
                            mainIcon: mainTopic.icon,
                            mainTag: mainTopic.tag,
                        }))
                    )
                )
                .filter(Boolean);

            const list = data
                .filter((item) =>
                    listSub?.some((topic) => item.parentIds.includes(topic?.id))
                )
                .map((item) => {
                    const matchingTopic = listSub.find((topic) =>
                        item.parentIds.includes(topic?.id)
                    );
                    return {
                        ...item,
                        icon: matchingTopic?.mainIcon,
                        tag: matchingTopic?.mainTag,
                    };
                });

            const incorrect = list.filter((item) => {
                const lastThreeAnswers = item.selectedAnswers?.slice(-3) || [];

                const totalAnswers = lastThreeAnswers.length;
                const incorrectAnswers = lastThreeAnswers.filter(
                    (answer) => !answer.correct
                ).length;

                const incorrectPercentage =
                    (incorrectAnswers / totalAnswers) * 100;

                return incorrectPercentage >= 50;
            });
            console.log("🚀 ~ handleGetData ~ incorrect:", incorrect);

            const mathType = incorrect.map((item) => ({
                ...item,
                parentId: -1,
            }));

            setListTopic(mathType);
            dispatch(setListQuestionGames(mathType));
        }
    }, [dispatch]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);
    const isMobile = useIsMobile();

    const getItemSize = (index: number) =>
        listTopic[index]?.image ? (isMobile ? 460 : 400) : isMobile ? 420 : 330;

    return (
        <div className="flex-1 h-full w-full">
            {listTopic?.length > 0 ? (
                <MathJaxContext>
                    <VariableSizeList
                        data={listTopic}
                        getItemSize={getItemSize}
                        item={(item) => (
                            <QuestionResult
                                item={{
                                    ...item,
                                    parentId: -1,
                                }}
                            />
                        )}
                    />
                </MathJaxContext>
            ) : (
                <Empty />
            )}
        </div>
    );
};

export default WeakQuestions;
