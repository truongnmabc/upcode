"use client";

import axiosInstance from "@/config/axios";
import { API_PATH } from "@/constants/api.constants";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestionOpt } from "@/models/question";
import { IGameMode } from "@/models/tests";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
    testId: number;
};

/**
 * Lưu trữ dữ liệu bài kiểm tra vào IndexedDB.
 *
 * @param {number} parentId - ID bài kiểm tra.
 * @param {IQuestionOpt[]} question - Danh sách câu hỏi.
 * @param {number} duration - Tổng thời gian làm bài.
 * @param {number} remainingTime - Thời gian còn lại.
 */
const setDataStore = async (
    parentId: number,
    question: IQuestionOpt[],
    totalDuration: number
) => {
    await db?.testQuestions.add({
        id: parentId,
        totalDuration,
        isGamePaused: false,
        startTime: new Date().getTime(),
        gameMode: "practiceTests",
        elapsedTime: 0,
        status: 0,
        attemptNumber: 1,
        groupExamData: [],
        passingThreshold: 0,
        topicIds: [],
        totalQuestion: question.length,
    });
};

/**
 * Lấy danh sách câu hỏi từ API dựa trên Test ID.
 *
 * @param {string | number} testId - ID của bài test cần lấy câu hỏi.
 * @return {Promise<IQuestionOpt[]>} - Danh sách câu hỏi từ API.
 */
export const fetchQuestions = async (
    testId: string | number
): Promise<IQuestionOpt[]> => {
    const response = await axiosInstance.get(
        `${API_PATH.GET_QUESTION_BY_ID}/${testId}`
    );
    return response?.data?.data;
};

/**
 * Lấy tiến trình người dùng từ local database (IndexedDB).
 *
 * @param {number} listIds - ID của bài test.
 * @param {"test" | "learn"} gameMode - Loại tiến trình ("test").
 * @param {number} turn - Số lần thực hiện bài test.
 * @return {Promise<IUserQuestionProgress[] | null>} - Danh sách tiến trình người dùng hoặc null nếu không có.
 */
export const getLocalUserProgress = async (
    listIds: number[],
    gameMode: IGameMode,
    turn: number
) => {
    // Lấy toàn bộ dữ liệu từ IndexedDB
    const userProgress = await db?.userProgress
        .where("id")
        .anyOf(listIds)
        .toArray();

    if (!userProgress) return [];

    // Lọc selectedAnswers sau khi lấy dữ liệu
    return userProgress
        .filter((progress) =>
            progress.selectedAnswers.some(
                (answer) => answer.turn === turn && answer.type === gameMode
            )
        )
        .map((progress) => ({
            ...progress,
            selectedAnswers: progress.selectedAnswers.filter(
                (answer) => answer.turn === turn && answer.type === gameMode
            ),
        }));
};

/**
 * Kết hợp dữ liệu câu hỏi với tiến trình người dùng và sắp xếp lại danh sách.
 *
 * @param {IQuestionOpt[]} questions - Danh sách câu hỏi.
 * @param {IUserQuestionProgress[]} progressData - Dữ liệu tiến trình người dùng.
 * @return {ICurrentGame[]} - Danh sách câu hỏi đã được cập nhật trạng thái từ tiến trình.
 */
export const mapQuestionsWithProgress = (
    questions: IQuestionOpt[],
    progressData: IUserQuestionProgress[]
) => {
    const mappedQuestions = questions.map((question) => {
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
            hasAnswer: selectedAnswers.length > 0, // Thêm thuộc tính để hỗ trợ sắp xếp
        };
    });

    // Sắp xếp: Câu hỏi đã có câu trả lời lên đầu
    return mappedQuestions.sort(
        (a, b) => Number(b.hasAnswer) - Number(a.hasAnswer)
    );
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
    async ({ testId }: IInitQuestion, thunkAPI) => {
        console.log("🚀 ~ testId:", testId);
        const state = thunkAPI.getState() as RootState;
        let { isDataFetched } = state.appInfoReducer;

        while (!isDataFetched) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi 100ms trước khi kiểm tra lại
            isDataFetched = (thunkAPI.getState() as RootState).appInfoReducer
                .isDataFetched;
        }

        const currentTest = await db?.testQuestions
            .where("id")
            .equals(testId)
            .first();

        let listQuestion: IQuestionOpt[] = [];
        const totalDuration = currentTest?.totalDuration || 60;

        const listIds =
            currentTest?.groupExamData?.flatMap((item) => item.questionIds) ||
            [];
        if (listIds?.length) {
            const questionsFromDb = await db?.questions
                .where("id")
                .anyOf(listIds)
                .toArray();
            if (questionsFromDb) listQuestion = questionsFromDb;
        }

        if (listQuestion.length === 0) {
            const result = await fetchQuestions(testId);
            listQuestion = result as unknown as IQuestionOpt[];
            await setDataStore(testId, listQuestion, totalDuration);
        }

        const progressData = await getLocalUserProgress(
            listIds,
            "practiceTests",
            currentTest?.attemptNumber || 1
        );
        const remainingTime =
            totalDuration * 60 - (currentTest?.elapsedTime || 0);

        if (progressData) {
            const questions = mapQuestionsWithProgress(
                listQuestion,
                progressData
            ) as IQuestionOpt[];
            return {
                questions,
                progressData,
                currentTopicId: testId,
                gameMode: "practiceTests" as IGameMode,
                totalDuration,
                isGamePaused: currentTest?.isGamePaused || false,
                remainingTime,
                attemptNumber: currentTest?.attemptNumber,
            };
        }
        return null;
    }
);

export default initPracticeThunk;
