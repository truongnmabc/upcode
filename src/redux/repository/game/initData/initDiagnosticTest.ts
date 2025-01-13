// "use client";

// import { db } from "@/db/db.model";
// import { ICurrentGame } from "@/models/game/game";
// import { IQuestion } from "@/models/question/questions";
// import { generateRandomNegativeId } from "@/utils/math";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import {
//     getLocalUserProgress,
//     mapQuestionsWithProgress,
// } from "./initPracticeTest";

// const setDataStoreDiagnostic = async ({
//     listQuestion,
//     belowFifty,
//     aboveFifty,
//     parentId,
// }: {
//     listQuestion: ICurrentGame[];
//     parentId: number;
//     aboveFifty: Record<string, ICurrentGame[]>;
//     belowFifty: Record<string, ICurrentGame[]>;
// }) => {
//     await db?.testQuestions.add({
//         parentId: parentId,
//         question: listQuestion as IQuestion[],
//         duration: 1,
//         aboveFifty,
//         belowFifty,
//         isPaused: false,
//         startTime: new Date().getTime(),
//         remainTime: 80,
//         type: "diagnosticTest",
//         status: 0,
//         turn: 0,
//     });
// };

// const initDiagnosticTestQuestionThunk = createAsyncThunk(
//     "initDiagnosticTest",
//     async () => {
//         const diagnostic = await db?.testQuestions
//             .where("type")
//             .equals("diagnosticTest")
//             .filter((item) => item.status === 0)
//             .first();
//         if (!diagnostic) {
//             const parentId = generateRandomNegativeId();
//             const listQuestion: ICurrentGame[] = [];
//             const belowFifty: Record<string, ICurrentGame[]> = {};
//             const aboveFifty: Record<string, ICurrentGame[]> = {};
//             const topic = await db?.topics.toArray();

//             if (topic) {
//                 for (const subTopic of topic) {
//                     const idTopic = subTopic?.topics?.[0].id;

//                     if (idTopic) {
//                         const ques = await db?.topicQuestion
//                             .where("parentId")
//                             .equals(idTopic)
//                             .toArray();

//                         const list = ques?.flatMap(
//                             (item) => item?.questions
//                         ) as IQuestion[];

//                         const listLevel2 = list?.filter(
//                             (item) => item.level === -1 || item.level === 50
//                         );
//                         const start =
//                             listLevel2?.[
//                                 Math.floor(Math.random() * listLevel2.length)
//                             ];
//                         const randomItem = {
//                             ...(start ||
//                                 list[Math.floor(Math.random() * list.length)]),
//                             tag: subTopic.tag,
//                             icon: subTopic.icon,
//                         };

//                         if (randomItem && list) {
//                             const belowFiftyQuestions = list.filter(
//                                 (item) =>
//                                     (item?.level || 0) < 50 &&
//                                     item.id !== randomItem?.id
//                             );
//                             const randomBelowFifty = belowFiftyQuestions
//                                 .sort(() => 0.5 - Math.random())
//                                 .slice(0, 2);

//                             // level : 3

//                             const aboveFiftyQuestions = list.filter(
//                                 (item) =>
//                                     item?.level > 50 &&
//                                     item.id !== randomItem?.id
//                             );

//                             const randomAboveFifty = aboveFiftyQuestions
//                                 .sort(() => 0.5 - Math.random())
//                                 .slice(0, 2);

//                             const randomList =
//                                 randomBelowFifty.length > 0
//                                     ? randomBelowFifty
//                                     : randomAboveFifty;

//                             listQuestion.push(
//                                 randomItem,
//                                 ...randomList?.map((item) => ({
//                                     ...item,
//                                     tag: subTopic.tag,
//                                     icon: subTopic.icon,
//                                 }))
//                             );

//                             belowFifty[subTopic.tag] = [
//                                 ...(randomBelowFifty.length > 0
//                                     ? randomBelowFifty
//                                     : randomAboveFifty),
//                             ];

//                             aboveFifty[subTopic.tag] = [
//                                 ...(randomAboveFifty.length > 0
//                                     ? randomAboveFifty
//                                     : randomBelowFifty),
//                             ];
//                         }
//                     }
//                 }
//             }

//             setDataStoreDiagnostic({
//                 listQuestion,
//                 belowFifty,
//                 aboveFifty,
//                 parentId,
//             });

//             return {
//                 listQuestion,
//                 belowFifty,
//                 aboveFifty,
//                 isPaused: false,
//                 idTopic: parentId,
//                 progressData: [],
//             };
//         } else {
//             const progressData = await getLocalUserProgress(
//                 diagnostic.parentId,
//                 "test",
//                 diagnostic.turn
//             );

//             if (progressData) {
//                 const questions = mapQuestionsWithProgress(
//                     diagnostic.question,
//                     progressData
//                 );

//                 return {
//                     progressData: progressData,
//                     listQuestion: questions,
//                     belowFifty: diagnostic.belowFifty,
//                     aboveFifty: diagnostic.aboveFifty,
//                     isPaused: true,
//                     idTopic: diagnostic.parentId,
//                 };
//             }
//         }
//         return undefined;
//     }
// );

// export default initDiagnosticTestQuestionThunk;

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
        turn: 0,
    });
};

/**
@return:
    - listQuestion: danh sách câu hỏi trong bài test
    - isPaused: trạng thái bài test: làmm mới hay làm lại
    - idTopic: id của bài test
    - progressData: tiến trình làm bài
    - belowFifty,aboveFifty: dựa vào kết quả trả lời của người dùng để lấy ra câu tiếp theo trong list này.
 */

const initDiagnosticTestQuestionThunk = createAsyncThunk(
    "initDiagnosticTest",
    async () => {
        //  kiểm tra bài test có trong cơ sở dữ liệu chưa
        const diagnostic = await db?.testQuestions
            .where("type")
            .equals("diagnosticTest")
            .filter((item) => item.status === 0)
            .first();
        if (!diagnostic) {
            //  tạo mới bài test, lọc qua list topics => subtopic
            //  lấy ra mỗi subtopic 1 câu.
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
                            const ques = await db?.topicQuestion
                                .where("parentId")
                                .equals(idTopic)
                                .toArray();

                            const list = ques
                                ?.filter((item) => item.contentType === 0)
                                ?.flatMap(
                                    (item) => item?.questions
                                ) as IQuestion[];

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

                                // level : 3

                                const aboveFiftyQuestions = list.filter(
                                    (item) =>
                                        item?.level > 50 &&
                                        item.id !== randomItem?.id
                                );

                                const randomAboveFifty = aboveFiftyQuestions
                                    .sort(() => 0.5 - Math.random())
                                    .slice(0, 2);

                                // const randomList =
                                //     randomBelowFifty.length > 0
                                //         ? randomBelowFifty
                                //         : randomAboveFifty;

                                listQuestion.push(
                                    randomItem
                                    // ...randomList?.map((item) => ({
                                    //     ...item,
                                    //     tag: topic.tag,
                                    //     icon: topic.icon,
                                    // }))
                                );

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
