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
import { ITopicProgress } from "@/models/topics/topicsProgress";
import { IGroupExam } from "@/models/tests/tests";

/**
 * Lưu trữ dữ liệu bài kiểm tra chuẩn đoán vào local database (IndexedDB).
 */
export const setDataStoreDiagnostic = async ({
    totalQuestion,
    id,
    topicIds,
    groupExamData,
}: {
    totalQuestion: number;
    id: number;
    topicIds: number[];
    groupExamData: IGroupExam[];
}) => {
    await db?.testQuestions.add({
        id: id,
        totalDuration: 1,
        isGamePaused: false,
        startTime: Date.now(),
        remainingTime: 80,
        gameMode: "diagnosticTest",
        status: 0,
        attemptNumber: 1,
        elapsedTime: 0,
        topicIds,
        groupExamData: groupExamData,
        passingThreshold: 0,
        totalQuestion,
    });
};

const mixData = async ({
    topics,
    questions,
}: {
    topics: ITopicProgress[];
    questions: ITopicQuestion[];
}) => {
    return topics.map((topic) => {
        // Lấy danh sách các subtopic thuộc topic hiện tại
        const subtopicIds = topic.topics.map((subtopic) => subtopic.id);

        // Lọc ra danh sách câu hỏi thuộc các subtopic này
        const questionIds = questions
            .filter((question) => subtopicIds.includes(question.subTopicId))
            .map((question) => question.id);

        return {
            title: topic.name,
            passingPercent: 0,
            totalQuestion: questionIds.length,
            questionIds,
        };
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
    const id = generateRandomNegativeId();
    const listQuestion: ITopicQuestion[] = [];

    const topics = await getTopics();
    if (!topics?.length) {
        return {
            listQuestion,
            isGamePaused: false,
            currentTopicId: id,
            progressData: [],
        };
    }

    const listSubTopic = topics.flatMap((topic) => topic.topics);
    const subTopicIds = listSubTopic.map((sub) => sub.id);

    if (!subTopicIds.length) {
        return {
            listQuestion,
            isGamePaused: false,
            currentTopicId: id,
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
            currentTopicId: id,
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
    const groupExamData = await mixData({
        topics,
        questions: listQuestion,
    });
    // Lưu vào IndexedDB
    await setDataStoreDiagnostic({
        totalQuestion: listQuestion.length,
        id,
        topicIds: topics.map((item) => item.id),
        groupExamData,
    });

    return {
        listQuestion,
        isGamePaused: false,
        currentTopicId: id,
        progressData: [],
    };
};

/**
 * Lấy dữ liệu bài kiểm tra đã tồn tại từ database.
 */
export const getExistingDiagnosticTest = async (diagnostic: ITestQuestion) => {
    const listIds =
        diagnostic.groupExamData?.flatMap((item) => item.questionIds) || [];
    const progressData = await getLocalUserProgress(
        listIds,
        "test",
        diagnostic.attemptNumber
    );

    const quesID =
        diagnostic.groupExamData?.flatMap((item) => item.questionIds) || [];

    const list =
        (await db?.questions.where("id").anyOf(quesID).toArray()) || [];
    const questions = mapQuestionsWithProgress(list, progressData || []);

    return {
        progressData,
        listQuestion: questions,
        isGamePaused: true,
        currentTopicId: diagnostic.id,
    };
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
