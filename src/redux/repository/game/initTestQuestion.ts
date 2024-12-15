"use client";

import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestion } from "@/models/question/questions";
import { ICurrentGame } from "@/redux/features/game";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
    testId?: string | null;
};

const setDataStore = async (parentId: number, question: IQuestion[]) => {
    await db.testQuestions.add({ parentId, question });
};

const fetchQuestions = async (testId: string): Promise<IQuestion[]> => {
    const response = await axiosInstance.get(
        `${API_PATH.GET_QUESTION_BY_ID}/${testId}`
    );
    return response?.data?.data;
};

const getLocalProgress = async (
    parentId: number,
    type: "test"
): Promise<IUserQuestionProgress[]> => {
    return db.userProgress
        .where("parentId")
        .equals(parentId)
        .filter((item) => item.type === type)
        .toArray();
};

const mapQuestionsWithProgress = (
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

const initTestQuestionThunk = createAsyncThunk(
    "initTestQuestionThunk",
    async ({ testId }: IInitQuestion) => {
        const id =
            testId ||
            (await db.tests.toArray())
                .find((test) => test.status === 0)
                ?.id?.toString();
        if (!id) throw new Error("Test ID not found");

        let listQuestion = (
            await db.testQuestions.where("parentId").equals(Number(id)).first()
        )?.question;
        if (!listQuestion) {
            listQuestion = await fetchQuestions(id);
            setDataStore(Number(id), listQuestion);
        }

        const progressData = await getLocalProgress(Number(id), "test");

        const questions = mapQuestionsWithProgress(listQuestion, progressData);

        return {
            questions,
            progressData,
            id: Number(id),
            type: "test" as const,
        };
    }
);

export default initTestQuestionThunk;
