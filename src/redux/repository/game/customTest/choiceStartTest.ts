"use client";

import { db } from "@/db/db.model";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "../initData/initPracticeTest";
import { ICurrentGame } from "@/models/game/game";

const choiceStartCustomTestThunk = createAsyncThunk(
    "startCustomTest",
    async ({ item }: { item: ITestQuestion }, thunkAPI) => {
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
