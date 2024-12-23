"use client";

import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestion } from "@/models/question/questions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICurrentGame } from "@/models/game/game";

type IInitQuestion = {
    testId?: string | null;
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
    type: "test"
): Promise<IUserQuestionProgress[] | null> => {
    return (
        db?.userProgress
            .where("parentId")
            .equals(parentId)
            .filter((item) => item.type === type)
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
        let id = testId;
        if (!testId) {
            const res = await db?.tests
                .filter((item) => item.status === 0)
                .first();
            if (res) {
                id = res?.id.toString();
                time = res?.duration;
            }
        }

        if (!id) throw new Error("Test ID not found");

        const currentTest = await db?.testQuestions
            .where("parentId")
            .equals(Number(id))
            .first();
        let listQuestion = currentTest?.question;

        time = currentTest?.duration || 60;

        const remainTime = currentTest?.remainTime || time * 60;

        if (!listQuestion) {
            listQuestion = await fetchQuestions(id);
            setDataStore(Number(id), listQuestion, time, remainTime);
        }

        const progressData = await getLocalUserProgress(Number(id), "test");
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
