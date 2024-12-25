"use client";

import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IQuestion } from "@/models/question/questions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchQuestions,
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";

const setDataStore = async (
    parentId: number,
    question: IQuestion[],
    duration: number,
    remainTime: number
) => {
    await db?.testQuestions.add({
        parentId,
        question,
        duration,
        isPaused: false,
        startTime: new Date().getTime(),
        remainTime: remainTime,
        type: "finalTests",
        status: 0,
        turn: 0,
    });
};

const initFinalTestThunk = createAsyncThunk("initFinalTestThunk", async () => {
    const dataStore = await db?.testQuestions
        .where("type")
        .equals("finalTests")
        .first();

    let listQuestion = dataStore?.question;

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
    } else {
        // *NOTE: doi check
        //     listQuestion = await fetchQuestions(diagnostic.id);
        //     setDataStore(
        //         diagnostic.id,
        //         listQuestion,
        //         diagnostic.duration,
        //         diagnostic.duration * 60
        //     );
    }
});

export default initFinalTestThunk;
