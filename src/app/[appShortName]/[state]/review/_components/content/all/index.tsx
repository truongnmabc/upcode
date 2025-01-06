import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import React, { useEffect, useState } from "react";
import ReviewAnswerResult from "@/components/reviewAnswers";

const AllQuestions = () => {
    const [tableData, setTabletData] = useState<{
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }>({
        all: [],
        correct: [],
        incorrect: [],
    });

    useEffect(() => {
        const handleGetData = async () => {
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
            }
        };
        handleGetData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col h-full">
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
