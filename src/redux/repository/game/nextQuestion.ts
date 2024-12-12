import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IStatusAnswer } from "@/components/study/contentGroup/mainStudyView/statusAnswer/statusAnswer";

const nextQuestionThunk = createAsyncThunk(
  "nextQuestionThunk",
  async ({ idTopic }: { idTopic: number }, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { listQuestion, listWrongAnswers } = state.gameReducer;

    const progressData = await db.userProgress
      .where("parentId")
      .equals(idTopic)
      .toArray();

    const firstUnansweredIndex = listQuestion.findIndex(
      (question) => !progressData.some((answer) => answer.id === question.id)
    );

    if (firstUnansweredIndex === -1) {
      const nextLever = listQuestion.findIndex(
        (item) => item.id === listWrongAnswers[0]
      );

      return {
        nextLever,
        isFist: false,
        nextQuestion: {
          ...listQuestion[nextLever],
          selectedAnswer: null,
          localStatus: "new" as IStatusAnswer,
        },
      };
    }

    return {
      nextLever: firstUnansweredIndex,
      nextQuestion: listQuestion[firstUnansweredIndex],
      isFist: true,
    };
  }
);

export default nextQuestionThunk;
