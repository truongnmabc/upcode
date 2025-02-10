// "use client";

// import { db } from "@/db/db.model";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { ITopicBase } from "@/models/topics/topicsProgress";

// type IInitQuestion = {
//     subTopicProgressId: number;
//     topicId: number;
// };

// const finishQuestionThunk = createAsyncThunk(
//     "finishQuestionThunk",
//     async ({ subTopicProgressId, topicId }: IInitQuestion) => {
//         try {
//             const currentProgress: ITopicBase | undefined = await db?.topics
//                 .filter((topic) =>
//                     topic.topics.some(
//                         (subTopic) => subTopic.id === subTopicProgressId
//                     )
//                 )
//                 .first();

//             if (!currentProgress) throw new Error("Progress not found");

//             // Clone dữ liệu để tránh tham chiếu vòng lặp
//             const clonedTopics: ITopicBase[] = JSON.parse(
//                 JSON.stringify(currentProgress.topics)
//             );

//             let isAllSubTopicsCompleted = true;

//             const updatedTopics = clonedTopics.map((subTopic) => {
//                 if (subTopic.id === subTopicProgressId) {
//                     const updatedSubTopics = subTopic.topics.map((part) =>
//                         part.id === topicId ? { ...part, status: 1 } : part
//                     );

//                     // Kiểm tra nếu tất cả part đã hoàn thành
//                     const isSubTopicCompleted = updatedSubTopics.every(
//                         (part) => part.status === 1
//                     );

//                     if (!isSubTopicCompleted) isAllSubTopicsCompleted = false;

//                     return {
//                         ...subTopic,
//                         topics: updatedSubTopics,
//                         status: isSubTopicCompleted ? 1 : subTopic.status,
//                     };
//                 }
//                 return subTopic;
//             });

//             // Cập nhật IndexedDB
//             await db?.topics.update(currentProgress.id, {
//                 topics: updatedTopics as unknown as Partial<ITopicBase>[], // Cập nhật danh sách topics đã clone
//                 status: isAllSubTopicsCompleted ? 1 : currentProgress.status,
//             });

//             console.log("✅ Update success: Topics updated.");
//         } catch (error) {
//             console.error("❌ Error in finishQuestionThunk:", error);
//         }
//     }
// );

// export default finishQuestionThunk;

"use client";

import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
    subTopicProgressId: number;
    topicId: number;
};

const finishQuestionThunk = createAsyncThunk(
    "finishQuestionThunk",
    async ({ subTopicProgressId, topicId }: IInitQuestion) => {
        try {
            const currentProgress = await db?.topics
                .filter((topic) =>
                    topic.topics.some(
                        (subTopic) => subTopic.id === subTopicProgressId
                    )
                )
                .first();

            if (!currentProgress) throw new Error("Progress not found");

            await db?.topics
                .where("id")
                .equals(currentProgress.id)
                .modify((topic) => {
                    let isAllSubTopicsCompleted = true;

                    topic.topics.forEach((subTopic) => {
                        if (subTopic.id === subTopicProgressId) {
                            subTopic.topics.forEach((part) => {
                                if (part.id === topicId) {
                                    part.status = 1; // Đánh dấu part hoàn thành
                                }
                            });

                            // Kiểm tra nếu tất cả part đã hoàn thành
                            const isSubTopicCompleted = subTopic.topics.every(
                                (part) => part.status === 1
                            );

                            if (!isSubTopicCompleted)
                                isAllSubTopicsCompleted = false;

                            subTopic.status = isSubTopicCompleted
                                ? 1
                                : subTopic.status;
                        }
                    });

                    // Nếu tất cả subtopic đã hoàn thành, cập nhật trạng thái topic
                    topic.status = isAllSubTopicsCompleted ? 1 : topic.status;
                });

            console.log("✅ Update success: Topics modified.");
        } catch (error) {
            console.error("❌ Error in finishQuestionThunk:", error);
        }
    }
);

export default finishQuestionThunk;
