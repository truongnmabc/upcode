"use client";
import { TypeParam } from "@/constants";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { ITopic } from "@/models/topics/topics";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ChartContentResultPage from "./chartContent";
import HeaderResultTest from "./header";
import MyContainer from "@/components/container";
import ReviewAnswerResult from "@/components/reviewAnswers";

export interface ITopicEndTest extends ITopic {
    totalQuestion: number;
    correct: number;
}
const ResultTestLayout = () => {
    const { idTopic, passing, listQuestion } = useAppSelector(gameState);
    const type = useSearchParams().get("type");

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
        if (idTopic && passing) {
            const [user, topics, questions] = await Promise.all([
                db?.userProgress.where("parentId").equals(idTopic).toArray(),
                db?.topics.toArray(),
                db?.testQuestions?.where("parentId").equals(idTopic).first(),
            ]);

            const listPass = user?.filter((item) =>
                item.selectedAnswers?.find((ans) => ans.correct)
            );

            let listTopic: ITopicEndTest[] = [];

            const listExam =
                questions?.groupExamData?.flatMap((item) => item.examData) ||
                [];

            if (type === TypeParam.diagnosticTest) {
                if (topics) {
                    listTopic = topics.map((t) => ({
                        ...t,
                        totalQuestion: 3,
                        correct: listQuestion.filter(
                            (q) => q.selectedAnswer?.correct && q.tag === t.tag
                        ).length,
                    }));
                }
            } else if (
                type === TypeParam.practiceTest ||
                type === TypeParam.finalTest
            ) {
                if (questions && topics && listExam) {
                    listTopic = topics
                        ?.filter((t) => questions?.topicIds?.includes(t.id))
                        ?.map((t) => {
                            const exam = listExam.find(
                                (e) => e.topicId === t.id
                            );
                            const correctList = listQuestion?.filter(
                                (q) =>
                                    exam?.questionIds?.includes(q.id) &&
                                    q.selectedAnswer?.correct
                            );

                            return {
                                ...t,
                                totalQuestion: exam?.totalQuestion || 1,
                                correct: correctList?.length || 0,
                            };
                        });
                }
            } else if (type === TypeParam.customTest) {
                if (topics && questions) {
                    const totalCount = questions?.count || 0;
                    const subjectCount = questions?.subject?.length || 1;

                    const baseQuestionCount = Math.floor(
                        totalCount / subjectCount
                    );

                    const remainder = totalCount % subjectCount;

                    listTopic = topics
                        ?.filter((t) => questions?.subject?.includes(t.id))
                        ?.map((t, index, array) => {
                            const isLast = index === array.length - 1;
                            const topicQuestions = listQuestion.filter(
                                (q) => q.parentId === t.id
                            );

                            const correctCount = topicQuestions.filter(
                                (q) => q.selectedAnswer?.correct
                            ).length;

                            return {
                                ...t,
                                totalQuestion:
                                    baseQuestionCount +
                                    (isLast ? remainder : 0),
                                correct: correctCount,
                            };
                        });
                }
            }

            const percent =
                listPass && listQuestion?.length
                    ? Math.floor((listPass.length / listQuestion.length) * 100)
                    : 0;

            const allQuestions =
                type === TypeParam.diagnosticTest ||
                type === TypeParam.customTest
                    ? listQuestion
                    : listQuestion.map((item) => {
                          const matchingExam = listExam?.find((exam) =>
                              exam.questionIds?.includes(item.id)
                          );
                          const matchingTopic = topics?.find(
                              (topic) => topic.id === matchingExam?.topicId
                          );

                          return {
                              ...item,
                              icon: matchingTopic?.icon || "",
                              tag: matchingTopic?.tag || "",
                              parentId: matchingTopic?.id || -1,
                          };
                      });

            setResult({
                pass: listPass?.length || 0,
                percent,
                isPass: percent >= passing,
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
    }, [idTopic, passing, listQuestion, type]);

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
            <MyContainer>
                <ChartContentResultPage listTopic={result.listTopic} />
                <ReviewAnswerResult
                    all={tableData.all}
                    correct={tableData.correct}
                    incorrect={tableData.incorrect}
                    setTabletData={setTabletData}
                    result={result}
                />
            </MyContainer>
        </div>
    );
};

export default ResultTestLayout;
