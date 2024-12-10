"use client";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestion } from "@/models/question/questions";
import TopicQuestion, { ITopicQuestion } from "@/models/question/topicQuestion";
import { requestGetData } from "@/services/request";
import { MyCrypto } from "@/utils/myCrypto";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
  testId?: string | null;
};

interface IResInitQuestion extends ITopicQuestion {
  progressData: IUserQuestionProgress[];
}

const initTestQuestionThunk = createAsyncThunk(
  "initTetsQuestionThunk",
  async ({ testId }: IInitQuestion): Promise<IResInitQuestion> => {
    if (testId) {
      console.log("🚀 ~ testId:", testId);
      const res = await db.tests.where("id").equals(Number(testId)).first();
      console.log("🚀 ~ res:", res);
      let progressData;

      // const { partId, subTopicId } = rest;

      // if (!res) {
      //   const data = (await requestGetData({
      //     url: `api/question/get-questions-by-part-id?partId=${partId}`,
      //     config: {
      //       baseURL: "https://api-cms-v2-dot-micro-enigma-235001.appspot.com",
      //     },
      //   })) as IQuestion[];

      //   const init = new TopicQuestion();
      //   return {
      //     ...init,
      //     questions: data.map((item) => ({
      //       ...item,
      //       text: MyCrypto.encrypt(item.text),
      //       explanation: MyCrypto.encrypt(item.explanation),
      //     })),
      //     progressData: [],
      //     id: partId || 0,
      //     parentId: subTopicId || 0,
      //   };
      // }

      // if (res?.id) {
      //   progressData = await db.userProgress
      //     .where("parentId")
      //     .equals(res?.id)
      //     .toArray();
      // }

      // const result = {
      //   ...res,
      //   progressData,
      // };

      // return result as IResInitQuestion;
    }
  }
);

export default initTestQuestionThunk;
