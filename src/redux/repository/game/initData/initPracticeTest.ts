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

/**
 * Lấy danh sách câu hỏi từ API dựa trên Test ID.
 *
 * @param {string | number} testId - ID của bài test cần lấy câu hỏi.
 * @return {Promise<IQuestion[]>} - Danh sách câu hỏi từ API.
 */

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

/**
 * Lấy tiến trình người dùng từ local database (IndexedDB).
 *
 * @param {number} parentId - ID của bài test.
 * @param {"test"} type - Loại tiến trình ("test").
 * @param {number} turn - Số lần thực hiện bài test.
 * @return {Promise<IUserQuestionProgress[] | null>} - Danh sách tiến trình người dùng hoặc null nếu không có.
 */

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

/**
 * Kết hợp dữ liệu câu hỏi với tiến trình người dùng.
 *
 * @param {ICurrentGame[]} questions - Danh sách câu hỏi.
 * @param {IUserQuestionProgress[]} progressData - Dữ liệu tiến trình người dùng.
 * @return {ICurrentGame[]} - Danh sách câu hỏi đã được cập nhật trạng thái từ tiến trình.
 */

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

/**
 * Khởi tạo và xử lý dữ liệu bài kiểm tra (Practice Test).
 *
 * @param {IInitQuestion} params - Thông tin bài kiểm tra bao gồm testId và thời gian làm bài.
 * @return {Promise<{
 *   questions: ICurrentGame[],
 *   progressData: IUserQuestionProgress[],
 *   idTopic: number,
 *   type: "test",
 *   duration: number,
 *   isPaused: boolean,
 *   remainTime: number
 * } | null>} - Dữ liệu bài kiểm tra đã khởi tạo hoặc null nếu không có.
 */

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
        return null;
    }
);

export default initPracticeThunk;
