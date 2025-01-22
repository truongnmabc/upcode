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
};

/**
 * Lưu trữ dữ liệu bài kiểm tra vào IndexedDB.
 *
 * @param {number} parentId - ID bài kiểm tra.
 * @param {IQuestion[]} question - Danh sách câu hỏi.
 * @param {number} duration - Tổng thời gian làm bài.
 * @param {number} remainingTime - Thời gian còn lại.
 */
const setDataStore = async (
    parentId: number,
    question: IQuestion[],
    totalDuration: number,
    remainingTime: number
) => {
    await db?.testQuestions.add({
        parentId,
        question,
        totalDuration,
        isGamePaused: false,
        startTime: new Date().getTime(),
        remainingTime: remainingTime,
        gameMode: "practiceTests",
        elapsedTime: 0,
        status: 0,
        attemptNumber: 1,
    });
};

/**
 * Lấy danh sách câu hỏi từ API dựa trên Test ID.
 *
 * @param {string | number} testId - ID của bài test cần lấy câu hỏi.
 * @return {Promise<IQuestion[]>} - Danh sách câu hỏi từ API.
 */
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
 * @param {"test"} gameMode - Loại tiến trình ("test").
 * @param {number} turn - Số lần thực hiện bài test.
 * @return {Promise<IUserQuestionProgress[] | null>} - Danh sách tiến trình người dùng hoặc null nếu không có.
 */
export const getLocalUserProgress = async (
    parentId: number,
    gameMode: "test",
    turn: number
): Promise<IUserQuestionProgress[] | null> => {
    return (
        db?.userProgress
            .filter((item) =>
                item.gameMode === gameMode &&
                item.selectedAnswers?.filter((i) => i.turn === turn).length
                    ? true
                    : false && item.parentIds.includes(parentId)
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
 *   currentTopicId: number,
 *   gameMode: "test",
 *   totalDuration: number,
 *   isGamePaused: boolean,
 *   remainingTime: number
 * } | null>} - Dữ liệu bài kiểm tra đã khởi tạo hoặc null nếu không có.
 */
const initPracticeThunk = createAsyncThunk(
    "initPracticeThunk",
    async ({ testId }: IInitQuestion) => {
        let currentTest;
        let id = testId || 0;

        if (!testId) {
            const res = await db?.testQuestions
                .where("gameMode")
                .equals("practiceTests")
                .filter((item) => item.status === 0)
                .first();

            if (res && res.id) {
                currentTest = res;
                id = res.id;
            }
        } else {
            currentTest = await db?.testQuestions
                .where("parentId")
                .equals(Number(testId))
                .first();
        }

        let listQuestion = currentTest?.question;
        const totalDuration = currentTest?.totalDuration || 60;
        const remainingTime =
            totalDuration * 60 - (currentTest?.elapsedTime || 0);

        if (!listQuestion) {
            listQuestion = await fetchQuestions(id);
            await setDataStore(id, listQuestion, totalDuration, remainingTime);
        }

        const progressData = await getLocalUserProgress(
            id,
            "test",
            currentTest?.attemptNumber || 1
        );

        if (progressData) {
            const questions = mapQuestionsWithProgress(
                listQuestion,
                progressData
            );

            return {
                questions,
                progressData,
                currentTopicId: id,
                gameMode: "test" as const,
                totalDuration,
                isGamePaused: currentTest?.isGamePaused || false,
                remainingTime,
            };
        }
        return null;
    }
);

export default initPracticeThunk;
