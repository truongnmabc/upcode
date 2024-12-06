"use client";
import { db } from "@/lib/db/db.model";
import { IUserQuestionProgress } from "@/lib/models/progress/userQuestionProgress";
import { ITopicQuestion } from "@/lib/models/question/topicQuestion";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
    subTopicTag: string;
    partTag: string;
};

interface IResInitQuestion extends ITopicQuestion {
    progressData: IUserQuestionProgress[];
}

// const initWhenReloadThunk = createAsyncThunk(
//     "initWhenReloadThunk",
//     async () => {
//         const data = localStorage.getItem("optQuery");

//         if (data) {
//             const optQuery: IQueryOpt = JSON.parse(data);
//             if (optQuery.partTag && optQuery.subTopicTag) {
//             }
//             localStorage.removeItem("optQuery");

//             return {
//                 partTag: optQuery.partTag,
//                 subTopicTag: optQuery.subTopicTag,
//             };
//         }
//     }
// );

const initQuestionThunk = createAsyncThunk(
    "createAsyncThunk",
    async ({
        subTopicTag,
        partTag,
    }: IInitQuestion): Promise<IResInitQuestion> => {
        const res = await db.topicQuestion
            .where("[subTopicTag+tag]")
            .equals([subTopicTag, partTag])
            .first();
        let progressData;
        if (res?.id) {
            progressData = await db.userProgress
                .where("parentId")
                .equals(res?.id)
                .toArray();
        }

        const result = {
            ...res,
            progressData,
        };

        return result as IResInitQuestion;
    }
);

export default initQuestionThunk;
