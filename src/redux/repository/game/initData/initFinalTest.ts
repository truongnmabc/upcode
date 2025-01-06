"use client";

import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";

const initFinalTestThunk = createAsyncThunk("initFinalTestThunk", async () => {
    const dataStore = await db?.testQuestions
        .where("type")
        .equals("finalTests")
        .first();

    const listQuestion = dataStore?.question;

    if (dataStore) {
        const progressData = await getLocalUserProgress(
            dataStore.parentId,
            "test",
            dataStore.turn + 1
        );
        if (progressData) {
            const questions = mapQuestionsWithProgress(
                listQuestion as ICurrentGame[],
                progressData
            );
            return {
                questions,
                progressData,
                idTopic: dataStore.parentId,
                type: "test" as const,
                duration: dataStore.duration,
                isPaused: dataStore?.isPaused || false,
                remainTime: dataStore?.remainTime || dataStore.duration * 60,
            };
        }
    }
});

export default initFinalTestThunk;
