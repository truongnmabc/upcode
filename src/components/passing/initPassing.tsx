"use client";

import { db } from "@/db/db.model";
import { selectIsDataFetched } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const InitPassing = () => {
    const isDataFetched = useAppSelector(selectIsDataFetched);

    useEffect(() => {
        const handleInitPassing = async () => {
            const isEx = await db?.passingApp.get(-1);
            if (isEx) return;

            const topics = await db?.topics.toArray();

            const totalQuestion =
                topics?.reduce((acc, topic) => {
                    return (
                        acc +
                        topic.topics.reduce((acc, subTopic) => {
                            return (
                                acc +
                                subTopic.topics.reduce((acc, part) => {
                                    return acc + part.totalQuestion;
                                }, 0)
                            );
                        }, 0)
                    );
                }, 0) || 0;

            const totalAve = topics?.reduce(
                (acc, topic) => acc + topic.averageLevel,
                0
            );

            const averageLevel = (totalAve || 0) / (topics?.length || 1);

            await db?.passingApp.add({
                id: -1,
                averageLevel,
                totalQuestion,
            });
        };
        if (isDataFetched) handleInitPassing();
    }, [isDataFetched]);
    return null;
};

export default InitPassing;
