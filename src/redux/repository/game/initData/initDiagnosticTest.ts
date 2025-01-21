"use client";

import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IQuestion } from "@/models/question/questions";
import { generateRandomNegativeId } from "@/utils/math";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "./initPracticeTest";
import { ITestQuestion } from "@/models/tests/testQuestions";

/**
 * Lưu trữ dữ liệu bài kiểm tra chuẩn đoán vào local database (IndexedDB).
 */
export const setDataStoreDiagnostic = async ({
    listQuestion,
    parentId,
}: {
    listQuestion: ICurrentGame[];
    parentId: number;
}) => {
    await db?.testQuestions.add({
        parentId,
        question: listQuestion as IQuestion[],
        duration: 1,
        isPaused: false,
        startTime: Date.now(),
        remainTime: 80,
        type: "diagnosticTest",
        status: 0,
        turn: 1,
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
    const ques = await db?.topicQuestion
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
export const getRandomQuestion = (questions: IQuestion[]) => {
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
    const listQuestion: ICurrentGame[] = [];
    const topics = await getTopics();

    if (topics) {
        for (const topic of topics) {
            for (const subtopic of topic.topics) {
                const idTopic = subtopic.id;
                if (!idTopic) continue;

                const questions = await getQuestionsBySubtopic(idTopic);

                if (!questions.length) continue;

                const randomItem = getRandomQuestion(questions);

                listQuestion.push({
                    ...randomItem,
                    tag: topic.tag,
                    icon: topic.icon,
                });
            }
        }
    }

    setDataStoreDiagnostic({
        listQuestion,
        parentId,
    });

    return {
        listQuestion,
        isPaused: false,
        idTopic: parentId,
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
        diagnostic.turn
    );

    if (progressData) {
        const questions = mapQuestionsWithProgress(
            diagnostic.question,
            progressData
        );

        return {
            progressData,
            listQuestion: questions,
            isPaused: true,
            idTopic: diagnostic.parentId,
        };
    }

    return undefined;
};

/**
 * Khởi tạo bài kiểm tra chuẩn đoán (Diagnostic Test).
 */
const initDiagnosticTestQuestionThunk = createAsyncThunk(
    "initDiagnosticTest",
    async () => {
        const diagnostic = await db?.testQuestions
            .where("type")
            .equals("diagnosticTest")
            .filter((item) => item.status === 0)
            .first();

        return diagnostic
            ? await getExistingDiagnosticTest(diagnostic)
            : await createNewDiagnosticTest();
    }
);

export default initDiagnosticTestQuestionThunk;
