"use client";
import { TypeParam } from "@/constants";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { ITopic } from "@/models/topics/topics";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ChartContentResultPage from "./chartContent";
import HeaderResultTest from "./header";
import MyContainer from "@/components/container";
import ReviewAnswerResult from "@/components/reviewAnswers";
import {
    selectIdTopic,
    selectListQuestion,
    selectPassing,
} from "@/redux/features/game.reselect";
import clsx from "clsx";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IExamData } from "@/models/tests/tests";
import { ITestQuestion } from "@/models/tests/testQuestions";

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

const calculatePassList = (user: IUserQuestionProgress[]) => {
    return user?.filter((item) =>
        item.selectedAnswers?.find((ans) => ans.correct)
    );
};

const getUniqueTags = (listQuestion: ICurrentGame[]) => {
    return listQuestion.reduce<string[]>((acc, question) => {
        if (question.tag && !acc.includes(question.tag)) {
            acc.push(question.tag);
        }
        return acc;
    }, []);
};

const getReviewTopics = (
    uniqueTags: string[],
    listQuestion: ICurrentGame[],
    topics: ITopic[]
): ITopicEndTest[] => {
    return uniqueTags
        .map((tag) => {
            const topic = topics?.find((t) => t.tag === tag);
            if (!topic) return null;

            const topicQuestions = listQuestion.filter((q) => q.tag === tag);
            const correctCount = topicQuestions.filter(
                (q) => q.selectedAnswer?.correct
            ).length;

            return {
                ...topic,
                totalQuestion: topicQuestions.length,
                correct: correctCount,
            };
        })
        .filter((item): item is ITopicEndTest => item !== null);
};

const calculateTopics = (
    type: string | null,
    topics: ITopic[] | undefined,
    questions: ITestQuestion | undefined,
    listExam: IExamData[],
    listQuestion: ICurrentGame[]
): ITopicEndTest[] => {
    let listTopic: ITopicEndTest[] = [];

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
    }

    if (type === TypeParam.practiceTest || type === TypeParam.finalTest) {
        if (questions && topics && listExam) {
            listTopic = topics
                ?.filter((t) => questions?.topicIds?.includes(t.id))
                ?.map((t) => {
                    const exam = listExam.find((e) => e.topicId === t.id);
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
    }

    if (type === TypeParam.customTest) {
        if (topics && questions) {
            const totalCount = questions?.count || 0;
            const subjectCount = questions?.subject?.length || 1;

            const baseQuestionCount = Math.floor(totalCount / subjectCount);
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
                            baseQuestionCount + (isLast ? remainder : 0),
                        correct: correctCount,
                    };
                });
        }
    }

    return listTopic;
};

const processAllQuestions = (
    type: string | null,
    listExam: IExamData[],
    listQuestion: ICurrentGame[],
    topics: ITopic[] | undefined
): ICurrentGame[] => {
    return type === TypeParam.diagnosticTest ||
        type === TypeParam.customTest ||
        type === TypeParam.review
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
};

const calculatePercentage = (
    listPass: ICurrentGame[],
    listQuestion: ICurrentGame[]
) => {
    return listPass && listQuestion?.length
        ? Math.floor((listPass.length / listQuestion.length) * 100)
        : 0;
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
        if (idTopic || testId) {
            const id = idTopic !== -1 ? idTopic : Number(testId);
            console.log("🚀 ~ handleGetData ~ id:", id);
            const { user, topics, questions } = await fetchData(id);
            console.log("🚀 ~ handleGetData ~ user:", user);
            console.log("🚀 ~ handleGetData ~ topics:", topics);
            console.log("🚀 ~ handleGetData ~ questions:", questions);
            const listPass =
                type === TypeParam.review
                    ? listQuestion.filter(
                          (item) => item.localStatus === "correct"
                      )
                    : calculatePassList(user || []);

            const listExam =
                questions?.groupExamData?.flatMap((item) => item.examData) ||
                [];

            let listTopic: ITopicEndTest[] = [];

            if (type === TypeParam.review) {
                const uniqueTags = getUniqueTags(listQuestion);
                listTopic = getReviewTopics(
                    uniqueTags,
                    listQuestion,
                    topics || []
                );
            } else {
                listTopic = calculateTopics(
                    type,
                    topics,
                    questions,
                    listExam,
                    listQuestion
                );
            }

            const percent = calculatePercentage(listPass, listQuestion);

            const allQuestions = processAllQuestions(
                type,
                listExam,
                listQuestion,
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
                <ChartContentResultPage listTopic={result.listTopic} />
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
            </MyContainer>
        </div>
    );
};

export default ResultTestLayout;
