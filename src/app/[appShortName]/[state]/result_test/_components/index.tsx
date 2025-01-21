"use client";
import MyContainer from "@/components/container";
import ReviewAnswerResult from "@/components/reviewAnswers";
import { TypeParam } from "@/constants";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { ITopic } from "@/models/topics/topics";
import {
    selectCurrentTopicId,
    selectListQuestion,
    selectPassingThreshold,
} from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import HeaderResultTest from "./header";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { calculatorAverageLevel } from "@/utils/math";
import { totalPassingPart } from "../../finish/_components/calculate";
import ItemListTopicResult from "./listTopicResult/item";
import {
    calculateTopics,
    getReviewTopics,
    getUniqueTags,
    processAllQuestions,
} from "./utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MtUiButton } from "@/components/button";
import DrawerAnswers from "./drawer";

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

type IPropsState = {
    listTopic: ITopicEndTest[];
    all: ICurrentGame[];
    correct: ICurrentGame[];
    incorrect: ICurrentGame[];
    passing: number;
};
const ResultTestLayout = () => {
    const listQuestion = useAppSelector(selectListQuestion);
    const idTopic = useAppSelector(selectCurrentTopicId);
    const passPercent = useAppSelector(selectPassingThreshold);
    const type = useSearchParams().get("type");
    const testId = useSearchParams().get("testId");
    const isMobile = useIsMobile();
    const [openDrawer, setOpenDrawer] = useState(false);

    const [result, setResult] = useState<IPropsState>({
        listTopic: [],
        all: [],
        correct: [],
        incorrect: [],
        passing: 0,
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

            const list = listQuestion?.length
                ? listQuestion
                : questions?.question || [];

            const listExam =
                questions?.groupExamData?.flatMap((item) => item.examData) ||
                [];

            let listTopic: ITopicEndTest[] = [];

            if (type === TypeParam.review) {
                const uniqueTags = getUniqueTags(list);
                listTopic = getReviewTopics(uniqueTags, list, topics || []);
            } else {
                listTopic = calculateTopics({
                    type,
                    topics,
                    questions,
                    listExam,
                    listQuestion: list,
                });
            }

            const allQuestions = processAllQuestions({
                type,
                listQuestion: list,
                listExam,
                topics,
            });
            const averageLevel = calculatorAverageLevel(list);

            const passingProbability = totalPassingPart(
                user as IUserQuestionProgress[],
                averageLevel
            );

            setResult({
                listTopic,
                all: allQuestions,
                incorrect: allQuestions.filter(
                    (item) => !item.selectedAnswer?.correct
                ),
                correct: allQuestions.filter(
                    (item) => item.selectedAnswer?.correct
                ),
                passing: passingProbability,
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
    }, [idTopic, listQuestion, type, testId]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    const handleOpenDrawer = () => setOpenDrawer(true);
    const handleCloseDrawer = () => setOpenDrawer(false);

    return (
        <div className="w-full flex-1">
            <div className="bg-white sm:bg-[#FFE1E1] ">
                <HeaderResultTest
                    correct={result.correct.length}
                    total={result.all.length}
                    isPass={
                        (result.correct.length / result.all.length) * 100 >
                        (passPercent || 0)
                    }
                    passing={result.passing}
                />
            </div>
            <MyContainer className="sm:pb-6 pb-4">
                {isMobile && type !== TypeParam.diagnosticTest && (
                    <div className="pt-4 ">
                        <MtUiButton
                            block
                            size="large"
                            className="bg-white text-primary border-primary"
                            onClick={handleOpenDrawer}
                        >
                            Review your answers
                        </MtUiButton>
                    </div>
                )}
                <div className="text-lg my-2 font-medium sm:hidden">
                    Test Subjects
                </div>
                <div className="w-full flex gap-10 justify-between  sm:mt-9">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                        {result.listTopic.map((item) => (
                            <ItemListTopicResult item={item} key={item.id} />
                        ))}
                    </div>
                </div>
                <DrawerAnswers
                    openDrawer={openDrawer}
                    handleCloseDrawer={handleCloseDrawer}
                    tableData={tableData}
                    result={result}
                    setTabletData={setTabletData}
                />
                {type !== TypeParam.diagnosticTest && !isMobile && (
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
