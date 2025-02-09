"use client";

import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalUserProgress } from "../initData/initPracticeTest";

const resumedCustomTestThunk = createAsyncThunk(
    "resumeCustomTestThunk",
    async ({ id }: { id: number }) => {
        const currentTest = await db?.testQuestions.get(id);

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

export default resumedCustomTestThunk;
