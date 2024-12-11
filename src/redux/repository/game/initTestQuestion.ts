"use client";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestion } from "@/models/question/questions";
import TopicQuestion, { ITopicQuestion } from "@/models/question/topicQuestion";
import { IGroupExam } from "@/models/tests/tests";
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
    let id;
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
    } else {
      const res = await db.tests.toArray();

      const testDefault = res[0].id;

      console.log("🚀 ~ testDefault:", testDefault);
    }
  }
);

export default initTestQuestionThunk;

const handleGetData = async (lists: IGroupExam[]) => {
  let result = [];
  for (const list of lists) {
    for (const item of list.examData) {
      // console.log("item id", item.topicId);
      const data = await db.topics.where("id").equals(item.topicId).toArray();
      // console.log("🚀 ~ handleGetData ~ data:", data);

      for (const topic of data) {
        const subTopic = topic.topics;
        // console.log("🚀 ~ handleGetData ~ subTopic:", subTopic);

        for (const sub of subTopic) {
          // console.log("🚀 ~ handleGetData ~ sub:", sub);
          const data = await db.topicQuestion
            .where("parentId")
            .equals(sub.id)
            .toArray();

          data.forEach((item) => {
            result.push(...item.questions?.map((item) => item.id));
          });
          // console.log("🚀 ~ handleGetData ~ data:", data);
        }
      }
    }
  }

  return result;
};
