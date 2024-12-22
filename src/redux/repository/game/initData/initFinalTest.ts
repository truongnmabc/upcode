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
    });
};

const initFinalTestThunk = createAsyncThunk("initFinalTestThunk", async () => {
    const diagnostic = await db?.tests
        .where("testType")
        .equals("finalTests")
        .first();

    if (diagnostic) {
        const dataStore = await db?.testQuestions
            .where("parentId")
            .equals(Number(diagnostic.id))
            .first();

        console.log("dataStore", dataStore);
        let listQuestion = dataStore?.question;

        if (!dataStore) {
            listQuestion = await fetchQuestions(diagnostic.id);
            setDataStore(
                diagnostic.id,
                listQuestion,
                diagnostic.duration,
                diagnostic.duration * 60
            );
        }

        const progressData = await getLocalUserProgress(diagnostic.id, "test");
        if (progressData) {
            const questions = mapQuestionsWithProgress(
                listQuestion as ICurrentGame[],
                progressData
            );
            return {
                questions,
                progressData,
                idTopic: diagnostic.id,
                type: "test" as const,
                duration: diagnostic.duration,
                isPaused: dataStore?.isPaused || false,
                remainTime: dataStore?.remainTime || diagnostic.duration * 60,
            };
        }
    }
});

export default initFinalTestThunk;
