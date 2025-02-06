"use client";

import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalUserProgress } from "./initPracticeTest";
import { RootState } from "@/redux/store";

const initCustomTestThunk = createAsyncThunk(
    "initCustomTestThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        let { isDataFetched } = state.appInfoReducer;

        while (!isDataFetched) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi 100ms trước khi kiểm tra lại
            isDataFetched = (thunkAPI.getState() as RootState).appInfoReducer
                .isDataFetched;
        }

        const currentTest = await db?.testQuestions
            .where("gameMode")
            .equals("customTets")
            .filter((item) => item.status === 0)
            .first();

        if (currentTest) {
            const listIds =
                currentTest.groupExamData.flatMap((i) => i.questionIds) || [];

            const progressData = await getLocalUserProgress(
                listIds,
                "customTets",
                currentTest.attemptNumber
            );
            const questionsFromDb = await db?.questions
                .where("id")
                .anyOf(listIds)
                .toArray();

            return {
                progressData: progressData || [],
                questions: questionsFromDb,
                currentTopicId: currentTest.id,
                gameMode: "customTets",
                totalDuration: currentTest.totalDuration,
                isGamePaused: currentTest.isGamePaused,
                remainingTime: currentTest.remainingTime,
                passingThreshold: currentTest.passingThreshold,
                attemptNumber: currentTest.attemptNumber,
            };
        }
        return null;
    }
);

export default initCustomTestThunk;
