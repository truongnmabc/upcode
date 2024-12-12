import { db } from "@/db/db.model";
import { IAnswer, IQuestion } from "@/models/question/questions";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const choiceAnswer = createAsyncThunk(
  "choiceAnswer",
  async (
    { question, choice }: { question: IQuestion; choice: IAnswer },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as RootState;
    const { type, turn } = state.gameReducer;

    const isEx = await db.userProgress.get(question.id);

    const data = {
      parentId: question.parentId,
      selectedAnswers: isEx
        ? [
            ...(isEx?.selectedAnswers || []),
            {
              ...choice,
              turn: turn,
            },
          ]
        : [
            {
              ...choice,
              turn: 1,
            },
          ],
      answers: question.answers,
      type: type,
      text: question.text,
      syncStatus: question.syncStatus,
      status: 1,
      id: question.id,
      level: question.level,
      explanation: question.explanation,
    };

    if (isEx) {
      await db.userProgress.update(question.id, data).catch((err) => {
        console.log("🚀 db.userProgress.update ~ err:", err);
      });
    } else {
      await db.userProgress.add(data).catch((err) => {
        console.log("🚀 db.userProgress.add ~ err:", err);
      });
    }

    return {
      choice,
      question,
    };
  }
);

export default choiceAnswer;
