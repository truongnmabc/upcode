import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IStatusAnswer } from "@/components/study/contentGroup/mainStudyView/statusAnswer/statusAnswer";

const nextQuestionThunk = createAsyncThunk(
  "nextQuestionThunk",
  async ({ idTopic }: { idTopic: number }, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { listQuestion, listWrongAnswers, turn } = state.gameReducer;
    console.log("🚀 ~ listQuestion:", listQuestion);

    const progressData = await db.userProgress
      .where("parentId")
      .equals(idTopic)
      .toArray();

    console.log("🚀 ~ progressData:", progressData);

    const firstUnansweredIndex = listQuestion.findIndex(
      (question) => !progressData.some((answer) => answer.id === question.id)
    );

    console.log("🚀 ~ firstUnansweredIndex:", firstUnansweredIndex);

    if (firstUnansweredIndex === -1) {
      const nextLever = listQuestion.findIndex(
        (item) => item.id === listWrongAnswers[0]
      );
      console.log("🚀 ~ nextLever:", nextLever);

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
