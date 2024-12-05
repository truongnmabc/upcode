import { db } from "@/lib/db/db.model";
import { IAnswer, IQuestion } from "@/lib/models/question/questions";
import { createAsyncThunk } from "@reduxjs/toolkit";

const choiceAnswer = createAsyncThunk(
  "choiceAnswer",
  async ({ question, choice }: { question: IQuestion; choice: IAnswer }) => {
    const data = {
      ...question,
      parentId: question.parentId,
      selectedAnswers: choice,
      correct: choice.correct,
    };

    await db.userProgress.add(data).catch((err) => {
      console.log("🚀 db.userProgress.add ~ err:", err);
    });
    return {
      choice,
      question,
    };
  }
);

export default choiceAnswer;
