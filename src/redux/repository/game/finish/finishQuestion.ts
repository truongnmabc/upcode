// "use client";
// import { db } from "@/db/db.model";
// import { createAsyncThunk } from "@reduxjs/toolkit";

// type IInitQuestion = {
//     subTopicProgressId: number;
//     topicId: number;
// };

// const finishQuestionThunk = createAsyncThunk(
//     "finishQuestionThunk",
//     async ({ subTopicProgressId, topicId }: IInitQuestion) => {
//         console.log("🚀 ~ topicId:", topicId);
//         console.log("🚀 ~ subTopicProgressId:", subTopicProgressId);
//         try {
//             const currentProgress = await db?.topics
//                 .filter((item) =>
//                     item.topics.find((topic) => topic.id === subTopicProgressId)
//                         ? true
//                         : false
//                 )
//                 .first();
//             console.log("🚀 ~ currentProgress:", currentProgress);

//             if (!currentProgress) throw new Error("Progress not found");

//             // *NOTE : còn 1 thằng chưa hoàn thành thì khi finish thì part sẽ qua

//             // const isUnfinished =
//             //     currentProgress.part?.filter((item) => item.status === 0)
//             //         ?.length === 1;

//             // const updatedPart = currentProgress.part?.map((item) => ({
//             //     ...item,
//             //     status: item.id === topicId ? 1 : item.status,
//             // }));

//             await db?.topics
//                 .where("id")
//                 .equals(currentProgress.id)
//                 .modify((item) => {
//                     item.topics = item.topics.map((topic) =>
//                         topic.id === subTopicProgressId
//                             ? {
//                                   ...topic,
//                                   topics: topic.topics.map((part) =>
//                                       part.id === topicId
//                                           ? { ...part, status: 1 }
//                                           : part
//                                   ),
//                               }
//                             : topic
//                     );
//                 });
//         } catch (error) {
//             console.error("Error in finishQuestionThunk:", error);
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

            if (!currentProgress) {
                throw new Error("Progress not found");
            }

            const updatedTopics = currentProgress.topics.map((subTopic) => {
                if (subTopic.id === subTopicProgressId) {
                    const updatedSubTopics = subTopic.topics.map((part) =>
                        part.id === topicId ? { ...part, status: 1 } : part
                    );

                    const isAllPartsCompleted = updatedSubTopics.every(
                        (part) => part.status === 1
                    );

                    return {
                        ...subTopic,
                        topics: updatedSubTopics,
                        status: isAllPartsCompleted ? 1 : subTopic.status,
                    };
                }
                return subTopic;
            });

            const isAllSubTopicsCompleted = updatedTopics.every(
                (subTopic) => subTopic.status === 1
            );

            await db?.topics.update(currentProgress.id, {
                topics: updatedTopics,
                status: isAllSubTopicsCompleted ? 1 : currentProgress.status,
            });
        } catch (error) {
            console.error("Error in finishQuestionThunk:", error);
        }
    }
);

export default finishQuestionThunk;
