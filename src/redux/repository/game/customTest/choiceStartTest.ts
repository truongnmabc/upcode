"use client";

import { ICurrentGame } from "@/models/game/game";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "../initData/initPracticeTest";

const choiceStartCustomTestThunk = createAsyncThunk(
    "startCustomTest",
    async ({ item }: { item: ITestQuestion }) => {
        const listQuestion = item?.question;
        const progressData = await getLocalUserProgress(
            item.parentId,
            "test",
            item.turn + 1
        );
        if (progressData) {
            const questions = mapQuestionsWithProgress(
                listQuestion as ICurrentGame[],
                progressData
            );
            return {
                questions,
                progressData,
                idTopic: item.parentId,
                type: "test" as const,
                duration: item.duration,
                isPaused: item?.isPaused || false,
                remainTime: item?.remainTime || item.duration * 60,
            };
        }
    }
);

export default choiceStartCustomTestThunk;
