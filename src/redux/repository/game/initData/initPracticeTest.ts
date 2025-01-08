"use client";

import axiosInstance from "@/config/axios";
import { API_PATH } from "@/constants/api.constants";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestion } from "@/models/question/questions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICurrentGame } from "@/models/game/game";

type IInitQuestion = {
    testId?: number | null;
    duration?: number;
};

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
        type: "practiceTests",
        status: 0,
        turn: 1,
    });
};

export const fetchQuestions = async (
    testId: string | number
): Promise<IQuestion[]> => {
    const response = await axiosInstance.get(
        `${API_PATH.GET_QUESTION_BY_ID}/${testId}`
    );
    return response?.data?.data;
};

export const getLocalUserProgress = async (
    parentId: number,
    type: "test",
    turn: number
): Promise<IUserQuestionProgress[] | null> => {
    return (
        db?.userProgress
            .where("parentId")
            .equals(parentId)
            .filter((item) =>
                item.type === type &&
                item.selectedAnswers?.filter((i) => i.turn === turn).length
                    ? true
                    : false
            )
            .toArray() ?? null
    );
};

export const mapQuestionsWithProgress = (
    questions: ICurrentGame[],
    progressData: IUserQuestionProgress[]
): ICurrentGame[] => {
    return questions.map((question) => {
        const progress = progressData.find((pro) => question.id === pro.id);
        const selectedAnswers = progress?.selectedAnswers || [];

        return {
            ...question,
            selectedAnswer:
                selectedAnswers.length > 0 ? selectedAnswers.at(-1) : null,
            localStatus: progress
                ? selectedAnswers.some((answer) => answer.correct)
                    ? "correct"
                    : "incorrect"
                : "new",
        } as ICurrentGame;
    });
};

const initPracticeThunk = createAsyncThunk(
    "initPracticeThunk",
    async ({ testId, duration }: IInitQuestion) => {
        let time = duration;
        const id = testId;
        let currentTest;
        if (!testId) {
            const res = await db?.testQuestions
                .filter((item) => item.status === 0)
                .first();
            if (res) {
                currentTest = res;
            }
        } else {
            currentTest = await db?.testQuestions
                .where("parentId")
                .equals(Number(id))
                .first();
        }

        if (!id) throw new Error("Test ID not found");

        let listQuestion = currentTest?.question;

        time = currentTest?.duration || 60;

        const remainTime = currentTest?.remainTime || time * 60;

        if (!listQuestion) {
            listQuestion = await fetchQuestions(id);
            setDataStore(Number(id), listQuestion, time, remainTime);
        }

        const progressData = await getLocalUserProgress(
            Number(id),
            "test",
            currentTest?.turn || 0
        );
        if (progressData) {
            const questions = mapQuestionsWithProgress(
                listQuestion,
                progressData
            );

            return {
                questions,
                progressData,
                idTopic: Number(id),
                type: "test" as const,
                duration: time,
                isPaused: currentTest?.isPaused || false,
                remainTime: remainTime,
            };
        }
    }
);

export default initPracticeThunk;
