"use client";

import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";
import { requestGetData } from "@/services/request";
import { RootState } from "@/redux/store";

const updateDB = async () => {
    db?.testQuestions
        .where("gameMode")
        .equals("finalTests")
        .modify((item) => (item.isGamePaused = false));
};
const initFinalTestThunk = createAsyncThunk(
    "initFinalTestThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        let { isDataFetched } = state.appInfoReducer;

        while (!isDataFetched) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi 100ms trước khi kiểm tra lại
            isDataFetched = (thunkAPI.getState() as RootState).appInfoReducer
                .isDataFetched;
        }

        const dataStore = await db?.testQuestions
            .where("gameMode")
            .equals("finalTests")
            .first();

        if (dataStore) {
            const listQuestion = dataStore?.question;

            const progressData = await getLocalUserProgress(
                dataStore.parentId,
                "test",
                dataStore.attemptNumber
            );

            if (progressData) {
                const questions = mapQuestionsWithProgress(
                    listQuestion as ICurrentGame[],
                    progressData
                );
                await updateDB();
                return {
                    questions,
                    progressData,
                    currentTopicId: dataStore.parentId,
                    gameMode: "test" as const,
                    totalDuration: dataStore.totalDuration,
                    isGamePaused: dataStore?.isGamePaused || false,
                    remainingTime:
                        dataStore?.remainingTime ||
                        dataStore.totalDuration * 60,
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
                currentTopicId: 4886547081986048,
                gameMode: "test" as const,
                totalDuration: 150,
                isGamePaused: false,
                remainingTime: 150 * 60,
            };
        }
    }
);

export default initFinalTestThunk;
