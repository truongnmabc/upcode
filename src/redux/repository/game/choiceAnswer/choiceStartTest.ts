"use client";

import { ITopicQuestion } from "@/models/question/topicQuestion";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "../initData/initPracticeTest";

interface IProps extends ITestQuestion {
    indexSubTopic: number;
}
const choiceStartCustomTestThunk = createAsyncThunk(
    "startCustomTest",
    async ({ item }: { item: IProps }) => {
        const listQuestion = item?.question;
        const progressData = await getLocalUserProgress(
            [item.id],
            "test",
            item.attemptNumber + 1
        );
        if (progressData) {
            const questions = mapQuestionsWithProgress(
                listQuestion as ITopicQuestion[],
                progressData
            );
            return {
                questions,
                progressData,
                currentTopicId: item.id,
                gameMode: "test" as const,
                totalDuration: item.totalDuration,
                isGamePaused: item?.isGamePaused || false,
                remainingTime: item?.remainingTime || item.totalDuration * 60,
                currentSubTopicIndex: item.indexSubTopic,
            };
        }
        return undefined;
    }
);

export default choiceStartCustomTestThunk;
