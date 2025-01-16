"use client";
import { TypeParam } from "@/constants";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { ITopic } from "@/models/topics/topics";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import HeaderResultTest from "./header";
import MyContainer from "@/components/container";
import ReviewAnswerResult from "@/components/reviewAnswers";
import {
    selectIdTopic,
    selectListQuestion,
    selectPassing,
} from "@/redux/features/game.reselect";
import clsx from "clsx";

import {
    calculatePassList,
    calculatePercentage,
    calculateTopics,
    getReviewTopics,
    processAllQuestions,
    getUniqueTags,
} from "./utils";
import ItemListTopicResult from "./listTopicResult/item";

export interface ITopicEndTest extends ITopic {
    totalQuestion: number;
    correct: number;
}

const fetchData = async (idTopic: number) => {
    const [user, topics, questions] = await Promise.all([
        db?.userProgress.where("parentId").equals(idTopic).toArray(),
        db?.topics.toArray(),
        db?.testQuestions?.where("parentId").equals(idTopic).first(),
    ]);

    return { user, topics, questions };
};

const ResultTestLayout = () => {
    const listQuestion = useAppSelector(selectListQuestion);
    const idTopic = useAppSelector(selectIdTopic);
    const passing = useAppSelector(selectPassing);
    const type = useSearchParams().get("type");
    const testId = useSearchParams().get("testId");

    const [result, setResult] = useState<{
        listTopic: ITopicEndTest[];
        pass: number;
        percent: number;
        isPass: boolean;
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }>({
        pass: 0,
        percent: 0,
        isPass: false,
        listTopic: [],
        all: [],
        correct: [],
        incorrect: [],
    });

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
        if (type === TypeParam.review && !listQuestion) {
            console.log("test");
            return;
        }

        if (idTopic || testId) {
            const id = idTopic !== -1 ? idTopic : Number(testId);
            const { user, topics, questions } = await fetchData(id);
            console.log("🚀 ~ handleGetData ~ user:", user);
            console.log("🚀 ~ handleGetData ~ topics:", topics);
            console.log("🚀 ~ handleGetData ~ questions:", questions);

            const list = listQuestion?.length
                ? listQuestion
                : questions?.question || [];

            const listPass =
                type === TypeParam.review
                    ? listQuestion.filter(
                          (item) => item.localStatus === "correct"
                      )
                    : calculatePassList(user || []);
            console.log("🚀 ~ handleGetData ~ listPass:", listPass);

            const listExam =
                questions?.groupExamData?.flatMap((item) => item.examData) ||
                [];

            let listTopic: ITopicEndTest[] = [];

            if (type === TypeParam.review) {
                const uniqueTags = getUniqueTags(list);
                listTopic = getReviewTopics(uniqueTags, list, topics || []);
            } else {
                listTopic = calculateTopics(
                    type,
                    topics,
                    questions,
                    listExam,
                    list
                );
            }

            const percent = calculatePercentage(listPass, list);

            const allQuestions = processAllQuestions(
                type,
                listExam,
                list,
                topics
            );

            setResult({
                pass: listPass?.length || 0,
                percent,
                isPass: percent >= (passing || 0),
                listTopic,
                all: allQuestions,
                incorrect: allQuestions.filter(
                    (item) => !item.selectedAnswer?.correct
                ),
                correct: allQuestions.filter(
                    (item) => item.selectedAnswer?.correct
                ),
            });

            setTabletData({
                all: allQuestions,
                incorrect: allQuestions.filter(
                    (item) => !item.selectedAnswer?.correct
                ),
                correct: allQuestions.filter(
                    (item) => item.selectedAnswer?.correct
                ),
            });
        }
    }, [idTopic, passing, listQuestion, type, testId]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div className="w-full flex-1">
            <div className="bg-[#FFE1E1]">
                <HeaderResultTest
                    isPass={result.isPass}
                    pass={result.pass}
                    percent={result.percent}
                />
            </div>
            <MyContainer className="sm:pb-6 pb-4">
                <div className="w-full flex gap-10 justify-between  mt-9">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                        {result.listTopic.map((item) => (
                            <ItemListTopicResult item={item} key={item.id} />
                        ))}
                    </div>
                </div>
                {type !== TypeParam.diagnosticTest && (
                    <div
                        className={clsx("w-full flex flex-col pt-6  ", {
                            "min-h-[720px]": tableData.all.length > 0,
                        })}
                    >
                        <ReviewAnswerResult
                            all={tableData.all}
                            correct={tableData.correct}
                            incorrect={tableData.incorrect}
                            setTabletData={setTabletData}
                            result={result}
                        />
                    </div>
                )}
            </MyContainer>
        </div>
    );
};

export default ResultTestLayout;
