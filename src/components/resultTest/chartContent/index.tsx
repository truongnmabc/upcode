"use client";
import React, { useEffect } from "react";
import RadarChart from "./chart/radarChart";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";
import { useSearchParams } from "next/navigation";
import { db } from "@/db/db.model";
import { ITopic } from "@/models/topics/topics";
import { RANDOM_COLORS } from "@/common/constants";
import ItemListTopicResult from "./listTopicResult/item";

export interface ITopicEndTest extends ITopic {
    totalQuestion: number;
    incorrect: number;
}
const ChartContentResultPage = () => {
    const { listQuestion } = useAppSelector(gameState);
    const type = useSearchParams().get("type");

    const [listTopic, setListTopic] = React.useState<ITopicEndTest[]>([]);

    useEffect(() => {
        const handleGetData = async () => {
            // if (type === "diagnostic_test") {
            const result = await db?.topics.toArray();

            if (result) {
                const newLisTopic = result.map((t) => ({
                    ...t,
                    totalQuestion: 3,
                    incorrect: listQuestion.filter(
                        (item) =>
                            item.selectedAnswer?.correct && item.tag === t.tag
                    ).length,
                }));

                setListTopic(newLisTopic);
            }
            // }
        };
        handleGetData();
    }, [listQuestion, type]);

    return (
        <div className="w-full flex gap-10 justify-between  mt-9">
            <RadarChart listTopic={listTopic} />

            <div className="flex-1 flex flex-col gap-4 ">
                {listTopic.map((item, index) => (
                    <ItemListTopicResult
                        item={{
                            ...item,
                            color: RANDOM_COLORS[index % RANDOM_COLORS.length],
                        }}
                        key={item.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChartContentResultPage;
