"use client";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/redux/features/game";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
  testId?: string | null;
};

const initTestQuestionThunk = createAsyncThunk(
  "initTetsQuestionThunk",
  async ({ testId }: IInitQuestion) => {
    let id = testId;

    if (!testId) {
      const res = await db.tests.toArray();
      id = res[0].id.toString();
    }
    const res = await axiosInstance.get(`${API_PATH.GET_QUESTION_BY_ID}/${id}`);
    const question: ICurrentGame[] = res.data?.data;
    return {
      questions: question?.map((item, index) => ({
        ...item,
        localStatus:
          index === 0
            ? "unlock"
            : ("lock" as "unlock" | "pass" | "miss" | "lock"),
      })),
      progressData: [],
    };
  }
);

export default initTestQuestionThunk;
