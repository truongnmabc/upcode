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

/**
 * Lưu trữ dữ liệu bài kiểm tra chuẩn đoán vào local database (IndexedDB).
 *
 * @param {object} params - Tham số truyền vào.
 * @param {ICurrentGame[]} params.listQuestion - Danh sách câu hỏi trong bài test.
 * @param {Record<string, ICurrentGame[]>} params.belowFifty - Các câu hỏi có level dưới 50, nhóm theo tag.
 * @param {Record<string, ICurrentGame[]>} params.aboveFifty - Các câu hỏi có level trên 50, nhóm theo tag.
 * @param {number} params.parentId - ID của bài test chuẩn đoán.
 * @return {Promise<void>} - Không trả về giá trị.
 */
const setDataStoreDiagnostic = async ({
    listQuestion,
    belowFifty,
    aboveFifty,
    parentId,
}: {
    listQuestion: ICurrentGame[];
    parentId: number;
    aboveFifty: Record<string, ICurrentGame[]>;
    belowFifty: Record<string, ICurrentGame[]>;
}) => {
    await db?.testQuestions.add({
        parentId: parentId,
        question: listQuestion as IQuestion[],
        duration: 1,
        aboveFifty,
        belowFifty,
        isPaused: false,
        startTime: new Date().getTime(),
        remainTime: 80,
        type: "diagnosticTest",
        status: 0,
        turn: 1,
    });
};

/**
 * Khởi tạo bài kiểm tra chuẩn đoán (Diagnostic Test).
 *
 * - Nếu bài kiểm tra đã tồn tại, tải dữ liệu bài kiểm tra từ local database.
 * - Nếu không, tạo mới bài kiểm tra bằng cách lấy ngẫu nhiên một số câu hỏi từ các subtopic.
 *
 * @return {Promise<object | undefined>} - Dữ liệu bài kiểm tra hoặc undefined nếu không có.
 */

const initDiagnosticTestQuestionThunk = createAsyncThunk(
    "initDiagnosticTest",
    async () => {
        // Tìm bài kiểm tra chuẩn đoán hiện tại trong database
        const diagnostic = await db?.testQuestions
            .where("type")
            .equals("diagnosticTest")
            .filter((item) => item.status === 0)
            .first();

        if (!diagnostic) {
            // Tạo bài kiểm tra mới
            const parentId = generateRandomNegativeId();
            const listQuestion: ICurrentGame[] = [];
            const belowFifty: Record<string, ICurrentGame[]> = {};
            const aboveFifty: Record<string, ICurrentGame[]> = {};
            const topics = await db?.topics.toArray();

            if (topics) {
                for (const topic of topics) {
                    for (const subtopic of topic.topics) {
                        const idTopic = subtopic.id;

                        if (idTopic) {
                            // Lấy danh sách câu hỏi theo subtopic
                            const ques = await db?.topicQuestion
                                .where("parentId")
                                .equals(idTopic)
                                .toArray();

                            const list = ques
                                ?.filter((item) => item.contentType === 0)
                                ?.flatMap(
                                    (item) => item?.questions
                                ) as IQuestion[];

                            // Lấy câu hỏi có level -1 hoặc 50
                            const listLevel2 = list?.filter(
                                (item) => item.level === -1 || item.level === 50
                            );
                            const start =
                                listLevel2?.[
                                    Math.floor(
                                        Math.random() * listLevel2.length
                                    )
                                ];

                            const randomItem = {
                                ...(start ||
                                    list[
                                        Math.floor(Math.random() * list.length)
                                    ]),
                                tag: topic.tag,
                                icon: topic.icon,
                            };

                            if (randomItem && list) {
                                const belowFiftyQuestions = list.filter(
                                    (item) =>
                                        (item?.level || 0) < 50 &&
                                        item.id !== randomItem?.id
                                );
                                const randomBelowFifty = belowFiftyQuestions
                                    .sort(() => 0.5 - Math.random())
                                    .slice(0, 2);

                                const aboveFiftyQuestions = list.filter(
                                    (item) =>
                                        item?.level > 50 &&
                                        item.id !== randomItem?.id
                                );

                                const randomAboveFifty = aboveFiftyQuestions
                                    .sort(() => 0.5 - Math.random())
                                    .slice(0, 2);

                                listQuestion.push(randomItem);

                                belowFifty[topic.tag] = [
                                    ...(randomBelowFifty.length > 0
                                        ? randomBelowFifty
                                        : randomAboveFifty),
                                ];

                                aboveFifty[topic.tag] = [
                                    ...(randomAboveFifty.length > 0
                                        ? randomAboveFifty
                                        : randomBelowFifty),
                                ];
                            }
                        }
                    }
                }
            }

            // Lưu bài kiểm tra mới vào database
            setDataStoreDiagnostic({
                listQuestion,
                belowFifty,
                aboveFifty,
                parentId,
            });

            return {
                listQuestion,
                belowFifty,
                aboveFifty,
                isPaused: false,
                idTopic: parentId,
                progressData: [],
            };
        } else {
            // Lấy tiến trình bài kiểm tra đã tồn tại
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
                    progressData: progressData,
                    listQuestion: questions,
                    belowFifty: diagnostic.belowFifty,
                    aboveFifty: diagnostic.aboveFifty,
                    isPaused: true,
                    idTopic: diagnostic.parentId,
                };
            }
        }

        return undefined;
    }
);

export default initDiagnosticTestQuestionThunk;
