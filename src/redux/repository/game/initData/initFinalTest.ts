"use client";

import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";
import { requestGetData } from "@/services/request";

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
            dataStore.turn
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
        return undefined;
    } else {
        const data = await requestGetData({
            url: `asvab/web-data/exam-4886547081986048.json`,
            config: {
                baseURL:
                    "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            },
        });

        return {
            questions: data as ICurrentGame[],
            progressData: [],
            idTopic: 4886547081986048,
            type: "test" as const,
            duration: 150,
            isPaused: false,
            remainTime: 150 * 60,
        };
    }
});

export default initFinalTestThunk;
