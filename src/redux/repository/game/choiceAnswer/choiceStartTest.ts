"use client";

import { db } from "@/db/db.model";
import { ITestBase } from "@/models/tests";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalUserProgress } from "../initData/initPracticeTest";

interface IProps extends ITestBase {
    indexSubTopic: number;
}
const choiceStartCustomTestThunk = createAsyncThunk(
    "startCustomTest",
    async ({ item }: { item: IProps }) => {
        const listIds = item?.groupExamData.flatMap((item) => item.questionIds);
        const progressData = await getLocalUserProgress(
            listIds,
            "customTets",
            item.attemptNumber
        );

        const questions = await db?.questions
            .where("id")
            .anyOf(listIds)
            .toArray();

        if (progressData) {
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
