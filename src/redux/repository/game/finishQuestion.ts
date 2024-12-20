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
            const currentProgress = await db?.subTopicProgress
                .where("id")
                .equals(subTopicProgressId)
                .first();

            if (!currentProgress) throw new Error("Progress not found");

            // *NOTE : còn 1 thằng chưa hoàn thành thì khi finish thì part sẽ qua

            const isUnfinished =
                currentProgress.part?.filter((item) => item.status === 0)
                    ?.length === 1;
            console.log("🚀 ~ isUnfinished:", isUnfinished);

            const updatedPart = currentProgress.part?.map((item) => ({
                ...item,
                status: item.id === topicId ? 1 : item.status,
            }));

            await db?.subTopicProgress
                .where("id")
                .equals(subTopicProgressId)
                .modify((item) => {
                    item.part = updatedPart;
                    item.pass = isUnfinished;
                })
                .then((res) => console.log("res", res))
                .catch((err) => console.log("err", err));
        } catch (error) {
            console.error("Error in finishQuestionThunk:", error);
        }
    }
);

export default finishQuestionThunk;
