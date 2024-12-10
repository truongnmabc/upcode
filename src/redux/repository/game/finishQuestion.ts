"use client";
import { db } from "@/db/db.model";
import Part from "@/models/topics/part";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
  subTopicProgressId: number;
  topicId: number;
};

const finishQuestionThunk = createAsyncThunk(
  "finishQuestionThunk",
  async ({ subTopicProgressId, topicId }: IInitQuestion) => {
    console.log("🚀 ~ topicId:", topicId);
    try {
      const currentProgress = await db.subTopicProgress
        .where("id")
        .equals(subTopicProgressId)
        .first();

      console.log("🚀 ~ currentProgress:", currentProgress);

      if (!currentProgress) throw new Error("Progress not found");

      const questionData = await db.topicQuestion
        .where("parentId")
        .equals(subTopicProgressId)
        .toArray();

      console.log("🚀 ~ questionData:", questionData);

      const existingParts = currentProgress.part;

      console.log("🚀 ~ existingParts:", existingParts);

      if (!existingParts) throw new Error("existingParts not found");

      const firstNewPart = questionData.find(
        (question) => !existingParts.some((part) => part.id === question.id)
      );

      console.log("🚀 ~ firstNewPart:", firstNewPart);

      const isMiss = existingParts.find((item) => item.status === 0);
      console.log("🚀 ~ isMiss:", isMiss);

      if (!isMiss) {
        await db.subTopicProgress
          .where("id")
          .equals(subTopicProgressId)
          .modify((record) => {
            record.pass = true;
          })
          .then((res) => console.log("db subTopicProgress updated", res));

        return;
      }

      if (firstNewPart) {
        const newPart = new Part(firstNewPart);

        const listUpdated = existingParts?.map((p) =>
          p.id === topicId ? { ...p, status: 1 } : p
        );
        console.log("🚀 ~ listUpdated:", listUpdated);

        listUpdated.push(newPart);

        await db.subTopicProgress
          .where("id")
          .equals(subTopicProgressId)
          .modify((record) => {
            record.part = listUpdated;
          })
          .then((res) => console.log("db update", res));
      } else {
        console.log("not firstNewPart");
        await db.subTopicProgress
          .where("id")
          .equals(subTopicProgressId)
          .modify((record) => {
            record.part = existingParts.map((item) => ({
              ...item,
              status: 1,
            }));
          })
          .then((res) => console.log("db subTopicProgress updated", res));
      }

      const updatedArray = await db.subTopicProgress
        .where("id")
        .equals(subTopicProgressId)
        .toArray();

      console.log("🚀 ~ updatedArray:", updatedArray);
    } catch (error) {
      console.error("Error in finishQuestionThunk:", error);
    }
  }
);

export default finishQuestionThunk;
