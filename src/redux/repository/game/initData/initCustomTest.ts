"use client";

import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalUserProgress } from "./initPracticeTest";

const initCustomTestThunk = createAsyncThunk(
    "initCustomTestThunk",
    async () => {
        const list = await db?.testQuestions
            .where("type")
            .equals("customTets")
            .toArray();

        if (list && list?.length > 0) {
            const currentTest = list.find((item) => item.status === 0);
            if (currentTest) {
                const progressData = await getLocalUserProgress(
                    currentTest.parentId,
                    "test",
                    currentTest.attemptNumber
                );

                return {
                    progressData: progressData || [],
                    questions: currentTest.question,
                    currentTopicId: currentTest.parentId,
                    gameMode: "test" as "test" | "learn",
                    totalDuration: currentTest.totalDuration,
                    isGamePaused: currentTest.isGamePaused,
                    remainingTime: currentTest.remainingTime,
                    passingThreshold: currentTest.passingThreshold,
                    attemptNumber: currentTest.attemptNumber,
                };
            }
            return null;
        }
        return null;
    }
);

export default initCustomTestThunk;
