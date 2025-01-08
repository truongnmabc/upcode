import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import React, { useCallback, useEffect, useState } from "react";
import ReviewAnswerResult from "@/components/reviewAnswers";
import clsx from "clsx";
import { useAppDispatch } from "@/redux/hooks";
import { setListQuestionGames } from "@/redux/features/game";

const AllQuestions = () => {
    const dispatch = useAppDispatch();

    const [tableData, setTabletData] = useState<{
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }>({
        all: [],
        correct: [],
        incorrect: [],
    });
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
                    listSub?.some((topic) => topic?.id === item.parentId)
                )
                .map((item) => {
                    const matchingTopic = listSub.find(
                        (topic) => topic?.id === item.parentId
                    );
                    return {
                        ...item,
                        icon: matchingTopic?.mainIcon,
                        tag: matchingTopic?.mainTag,
                    };
                });

            setTabletData({
                all: list,
                incorrect: list.filter((item) =>
                    item.selectedAnswers?.find((item) => !item?.correct)
                ),
                correct: list.filter((item) =>
                    item.selectedAnswers?.find((item) => item?.correct)
                ),
            });
            dispatch(setListQuestionGames(list));
        }
    }, [dispatch]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div
            className={clsx("w-full flex-1 flex flex-col transition-all ", {
                // "min-h-full": tableData.all.length > 0,
            })}
        >
            <ReviewAnswerResult
                all={tableData.all}
                correct={tableData.correct}
                incorrect={tableData.incorrect}
                showFilter={false}
                title=""
            />
        </div>
    );
};

export default AllQuestions;
