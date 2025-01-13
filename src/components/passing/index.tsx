"use client";
import React, { useCallback, useEffect, useState } from "react";
import "./passing.css";
import { db } from "@/db/db.model";
// import { useAppSelector } from "@/redux/hooks";
// import { gameState } from "@/redux/features/game";
// import { calculatorAverageLevel } from "@/utils/math";

const PassingProbability = () => {
    const [passingValue, setPassingValue] = useState(0);
    // const [averageLevel, setAverageLevel] = useState(0);
    // const { idTopic, currentGame } = useAppSelector(gameState);

    // useEffect(() => {
    //     const calculateAverageLevel = async () => {
    //         if (!idTopic) return;

    //         const topicQuestion = await db?.topicQuestion
    //             .where("id")
    //             .equals(idTopic)
    //             .first();

    //         if (topicQuestion?.questions?.length) {
    //             const average = calculatorAverageLevel(topicQuestion.questions);
    //             setAverageLevel(average);
    //         }
    //     };
    //     calculateAverageLevel();
    // }, [idTopic]);

    // useEffect(() => {
    //     const calculatePassingValue = async () => {
    //         if (!idTopic || !averageLevel) return;

    //         const userProgress = await db?.userProgress
    //             .where("parentId")
    //             .equals(idTopic)
    //             .toArray();

    //         if (userProgress?.length) {
    //             const lastThreeElements = userProgress.slice(-3);

    //             const passAnswerCount = lastThreeElements.filter((item) =>
    //                 item.selectedAnswers?.find((item) => item.correct)
    //             ).length;

    //             const passingProbability =
    //                 passAnswerCount / lastThreeElements.length;

    //             const totalPass = lastThreeElements.reduce(
    //                 (acc, cur) =>
    //                     acc +
    //                     passingProbability *
    //                         (((cur.level < 0 ? 50 : cur.level) / averageLevel) *
    //                             100),
    //                 0
    //             );
    //             const passing = totalPass / lastThreeElements.length;

    //             setPassingValue(passing > 96 ? 96 : passing);
    //         } else {
    //             setPassingValue(0);
    //         }
    //     };

    //     calculatePassingValue();
    // }, [idTopic, averageLevel, currentGame.id]);

    const handleGetData = useCallback(async () => {
        const data = await db?.passing.toArray();
        if (data?.length) {
            const passing = data?.reduce((acc, cur) => acc + cur.passing, 0);
            console.log("🚀 ~ handleGetData ~ passing:", passing);
            setPassingValue(passing / data.length);
        }
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);
    return (
        <div className="p-4 rounded-md bg-[#2121210A] dark:bg-black">
            <h3 className="font-semibold truncate text-lg">
                Passing Probability
            </h3>
            <div className="mt-3 h-12 w-full custom-progress relative">
                <progress
                    value={passingValue}
                    max={100}
                    className="w-full"
                ></progress>
                <div className="progress-label ">
                    {passingValue.toFixed(2)}%
                </div>
            </div>
        </div>
    );
};

export default React.memo(PassingProbability);
