"use client";

import { db } from "@/db/db.model";
import { IQuestion } from "@/models/question/questions";
import { ITopicQuestion } from "@/models/question/topicQuestion";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { RootState } from "@/redux/store";
import { generateRandomNegativeId } from "@/utils/math";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";

/**
 * Lưu trữ dữ liệu bài kiểm tra chuẩn đoán vào local database (IndexedDB).
 */
export const setDataStoreDiagnostic = async ({
    listQuestion,
    parentId,
}: {
    listQuestion: ITopicQuestion[];
    parentId: number;
}) => {
    await db?.testQuestions.add({
        id: parentId,
        question: listQuestion,
        totalDuration: 1,
        isGamePaused: false,
        startTime: Date.now(),
        remainingTime: 80,
        gameMode: "diagnosticTest",
        isPaused: false,
        status: 0,
        attemptNumber: 1,
        elapsedTime: 0,
    });
};

/**
 * Lấy danh sách tất cả các topic từ database.
 */
const getTopics = async () => {
    return await db?.topics.toArray();
};

/**
 * Lấy danh sách câu hỏi của một subtopic từ database.
 */
export const getQuestionsBySubtopic = async (subtopicId: number) => {
    const ques = await db?.questions
        .where("parentId")
        .equals(subtopicId)
        .toArray();

    return ques
        ?.filter((item) => item.contentType === 0)
        ?.flatMap((item) => item?.questions) as IQuestion[];
};

/**
 * Chọn câu hỏi ngẫu nhiên từ danh sách câu hỏi.
 */
export const getRandomQuestion = (questions: ITopicQuestion[]) => {
    const priorityQuestions = questions?.filter(
        (item) => item.level === -1 || item.level === 50
    );

    return (
        priorityQuestions?.[
            Math.floor(Math.random() * priorityQuestions.length)
        ] || questions[Math.floor(Math.random() * questions.length)]
    );
};

/**
 * Xử lý logic khởi tạo bài kiểm tra mới.
 */

export const createNewDiagnosticTest = async () => {
    const parentId = generateRandomNegativeId();
    const listQuestion: ITopicQuestion[] = [];

    const topics = await getTopics();
    if (!topics?.length) {
        return {
            listQuestion,
            isGamePaused: false,
            currentTopicId: parentId,
            progressData: [],
        };
    }

    const listSubTopic = topics.flatMap((topic) => topic.topics);
    const subTopicIds = listSubTopic.map((sub) => sub.id);

    if (!subTopicIds.length) {
        return {
            listQuestion,
            isGamePaused: false,
            currentTopicId: parentId,
            progressData: [],
        };
    }

    // Lấy tất cả câu hỏi của các subTopic trong một lần truy vấn
    const allQuestions = await db?.questions
        .where("subTopicId")
        .anyOf(subTopicIds)
        .toArray();

    if (!allQuestions?.length) {
        return {
            listQuestion,
            isGamePaused: false,
            currentTopicId: parentId,
            progressData: [],
        };
    }

    for (const subtopic of listSubTopic) {
        const questions = allQuestions.filter(
            (q) => q.subTopicId === subtopic.id
        );
        if (!questions.length) continue;

        const randomItem = getRandomQuestion(questions);
        if (randomItem) {
            listQuestion.push(randomItem);
        }
    }

    // Lưu vào IndexedDB
    await setDataStoreDiagnostic({ listQuestion, parentId });

    return {
        listQuestion,
        isGamePaused: false,
        currentTopicId: parentId,
        progressData: [],
    };
};

/**
 * Lấy dữ liệu bài kiểm tra đã tồn tại từ database.
 */
export const getExistingDiagnosticTest = async (diagnostic: ITestQuestion) => {
    const progressData = await getLocalUserProgress(
        diagnostic.parentId,
        "test",
        diagnostic.attemptNumber
    );
    console.log("🚀 ~ getExistingDiagnosticTest ~ progressData:", progressData);

    if (progressData) {
        const questions = mapQuestionsWithProgress(
            diagnostic.question,
            progressData
        );

        return {
            progressData,
            listQuestion: questions,
            isGamePaused: true,
            currentTopicId: diagnostic.id,
        };
    }

    return undefined;
};

/**
 * Khởi tạo bài kiểm tra  (Diagnostic Test).
 */
const initDiagnosticTestQuestionThunk = createAsyncThunk(
    "initDiagnosticTest",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        let { isDataFetched } = state.appInfoReducer;

        while (!isDataFetched) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi 100ms trước khi kiểm tra lại
            isDataFetched = (thunkAPI.getState() as RootState).appInfoReducer
                .isDataFetched;
        }

        const diagnostic = await db?.testQuestions
            .where("gameMode")
            .equals("diagnosticTest")
            .filter((item) => item.status === 0)
            .first();

        return diagnostic
            ? await getExistingDiagnosticTest(diagnostic)
            : await createNewDiagnosticTest();
    }
);

export default initDiagnosticTestQuestionThunk;
