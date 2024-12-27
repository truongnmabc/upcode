"use client";
import React, { useEffect } from "react";
// import RadarChart from "./chart/radarChart";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";
import { useSearchParams } from "next/navigation";
import { db } from "@/db/db.model";
import { ITopic } from "@/models/topics/topics";
import { RANDOM_COLORS, TypeParam } from "@/common/constants";
import ItemListTopicResult from "./listTopicResult/item";

export interface ITopicEndTest extends ITopic {
    totalQuestion: number;
    correct: number;
}
const ChartContentResultPage = () => {
    const { listQuestion, idTopic } = useAppSelector(gameState);
    const type = useSearchParams().get("type");

    const [listTopic, setListTopic] = React.useState<ITopicEndTest[]>([]);

    useEffect(() => {
        const handleGetData = async () => {
            if (type === TypeParam.diagnosticTest) {
                const result = await db?.topics.toArray();

                if (result) {
                    const newLisTopic = result.map((t) => ({
                        ...t,
                        totalQuestion: 3,
                        correct: listQuestion.filter(
                            (item) =>
                                item.selectedAnswer?.correct &&
                                item.tag === t.tag
                        ).length,
                    }));

                    setListTopic(newLisTopic);
                }
            }

            if (type === TypeParam.practiceTest) {
                const topics = await db?.topics.toArray();

                const data = await db?.testQuestions
                    ?.where("parentId")
                    .equals(idTopic)
                    .first();

                const listExam = data?.groupExamData?.flatMap(
                    (item) => item.examData
                );

                if (data && topics && listExam) {
                    const listTopic = topics
                        ?.filter((item) => data?.topicIds?.includes(item.id))
                        ?.map((item) => {
                            const exam = listExam?.find(
                                (e) => e.topicId === item.id
                            );
                            const list = listQuestion?.filter(
                                (q) =>
                                    exam?.questionIds?.includes(q.id) &&
                                    q.selectedAnswer?.correct
                            );

                            return {
                                ...item,
                                totalQuestion: exam?.totalQuestion || 1,
                                correct: list?.length,
                            };
                        });

                    setListTopic(listTopic);
                }
            }
        };
        handleGetData();
    }, [listQuestion, type, idTopic]);

    return (
        <div className="w-full flex gap-10 justify-between  mt-9">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 ">
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
