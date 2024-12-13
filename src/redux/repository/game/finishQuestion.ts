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
    console.log("🚀 ~ subTopicProgressId:", subTopicProgressId);
    console.log("🚀 ~ topicId:", topicId);
    try {
      const currentProgress = await db.subTopicProgress
        .where("id")
        .equals(subTopicProgressId)
        .first();

      console.log("🚀 ~ currentProgress:", currentProgress);

      if (!currentProgress) throw new Error("Progress not found");

      const isUnfinished = currentProgress.part?.some(
        (item) => item.status === 0
      );

      const updatedPart = currentProgress.part?.map((item) => ({
        ...item,
        status: item.id === topicId ? 1 : item.status,
      }));

      await db.subTopicProgress
        .where("id")
        .equals(subTopicProgressId)
        .modify((item) => {
          (item.part = updatedPart), (item.pass = !isUnfinished);
        })
        .catch((err) => console.log("err", err));

      const dbUpdate = await db.subTopicProgress
        .where("id")
        .equals(subTopicProgressId)
        .first();

      console.log("🚀 ~ currentProgress:", dbUpdate);
    } catch (error) {
      console.error("Error in finishQuestionThunk:", error);
    }
  }
);

export default finishQuestionThunk;
