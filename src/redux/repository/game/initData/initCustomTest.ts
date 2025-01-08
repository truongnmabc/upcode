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
                    currentTest.turn
                );

                return {
                    progressData: progressData || [],
                    questions: currentTest.question,
                    idTopic: currentTest.parentId,
                    type: "test" as "test" | "learn",
                    duration: currentTest.duration,
                    isPaused: currentTest.isPaused,
                    remainTime: currentTest.remainTime,
                    passing: currentTest.passing,
                    turn: currentTest.turn,
                };
            }
            return null;
        }
        return null;
    }
);

export default initCustomTestThunk;
