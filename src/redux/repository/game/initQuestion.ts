"use client";
import { IStatusAnswer } from "@/components/study/contentGroup/mainStudyView/statusAnswer/statusAnswer";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IAnswer, IQuestion } from "@/models/question/questions";
import TopicQuestion, { ITopicQuestion } from "@/models/question/topicQuestion";
import { RootState } from "@/redux/store";
import { requestGetData } from "@/services/request";
import { MyCrypto } from "@/utils/myCrypto";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
  subTopicTag: string;
  partTag: string;
  partId?: number;
  subTopicId?: number;
  isReset?: boolean;
};

interface IResInitQuestion {
  progressData?: IUserQuestionProgress[] | null;
  questions?: IQuestion[];
  id: number;
  parentId: number;
}

const initQuestionThunk = createAsyncThunk(
  "initQuestionThunk",
  async (
    { subTopicTag, partTag, ...rest }: IInitQuestion,
    thunkAPI
  ): Promise<IResInitQuestion> => {
    const res = await db.topicQuestion
      .where("[subTopicTag+tag]")
      .equals([subTopicTag, partTag])
      .first();
    let progressData: IUserQuestionProgress[] = [];
    const state = thunkAPI.getState() as RootState;
    const { turn } = state.gameReducer;
    const { partId, subTopicId, isReset } = rest;

    if (!res) {
      const data = (await requestGetData({
        url: `api/question/get-questions-by-part-id?partId=${partId}`,
        config: {
          baseURL: "https://api-cms-v2-dot-micro-enigma-235001.appspot.com",
        },
      })) as IQuestion[];

      return {
        questions: data.map((item) => ({
          ...item,
          text: MyCrypto.encrypt(item.text),
          explanation: MyCrypto.encrypt(item.explanation),
          localStatus: "new",
        })),
        progressData: [],
        id: partId || 0,
        parentId: subTopicId || 0,
      };
    }

    if (res?.id) {
      progressData = await db.userProgress
        .where("parentId")
        .equals(res?.id)
        .filter((item) => item.type === "learn")
        .toArray();
    }

    const question = isReset
      ? res.questions?.map((item) => ({
          ...item,
          turn: turn,
        }))
      : res?.questions?.map((que) => {
          const progress = progressData?.find((pro) => que.id === pro.id);

          const selectedAnswers = progress?.selectedAnswers || [];

          return {
            ...que,
            selectedAnswer: !progress
              ? null
              : selectedAnswers[selectedAnswers?.length - 1],
            localStatus: (!progress
              ? "new"
              : selectedAnswers?.find((pro) => pro.correct)
              ? "correct"
              : "incorrect") as IStatusAnswer,
            turn: turn,
          };
        });

    const result = {
      questions: question,
      progressData: isReset ? [] : progressData,
      id: res.id,
      parentId: res.parentId,
    };
    console.log("🚀 ~ result:", result);

    return result;
  }
);

export default initQuestionThunk;
