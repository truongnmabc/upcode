"use client";
import { db } from "@/lib/db/db.model";
import { IUserQuestionProgress } from "@/lib/models/progress/userQuestionProgress";
import { IQuestion } from "@/lib/models/question/questions";
import TopicQuestion, {
  ITopicQuestion,
} from "@/lib/models/question/topicQuestion";
import { requestGetData } from "@/lib/services/request";
import { MyCrypto } from "@/utils/myCrypto";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
  subTopicTag: string;
  partTag: string;
  partId?: number;
  subTopicId?: number;
};

interface IResInitQuestion extends ITopicQuestion {
  progressData: IUserQuestionProgress[];
}

const initQuestionThunk = createAsyncThunk(
  "initQuestionThunk",
  async ({
    subTopicTag,
    partTag,
    ...rest
  }: IInitQuestion): Promise<IResInitQuestion> => {
    const res = await db.topicQuestion
      .where("[subTopicTag+tag]")
      .equals([subTopicTag, partTag])
      .first();
    let progressData;

    const { partId, subTopicId } = rest;

    if (!res) {
      const data = (await requestGetData({
        url: `api/question/get-questions-by-part-id?partId=${partId}`,
        config: {
          baseURL: "https://api-cms-v2-dot-micro-enigma-235001.appspot.com",
        },
      })) as IQuestion[];

      const init = new TopicQuestion();
      return {
        ...init,
        questions: data.map((item) => ({
          ...item,
          text: MyCrypto.encrypt(item.text),
          explanation: MyCrypto.encrypt(item.explanation),
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
        .toArray();
    }

    const result = {
      ...res,
      progressData,
    };

    return result as IResInitQuestion;
  }
);

export default initQuestionThunk;
