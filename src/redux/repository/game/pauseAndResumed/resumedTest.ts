import { db } from "@/db/db.model";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IRes = {
    type: "customTest" | "finalTest" | "diagnosticTest" | "practiceTest";
};

const deleteDataQuestion = async (parentId?: number) => {
    if (parentId) {
        await db?.testQuestions
            .where("parentId")
            .equals(parentId)
            .delete()
            .then((res) => console.log("deleteDataQuestion", res))
            .catch((err) => console.log("err", err));
    }
};

const deleteDataUser = async (parentId?: number) => {
    if (parentId) {
        await db?.userProgress
            .where("parentId")
            .equals(parentId)
            .and((item) => item.gameMode === "test")
            .delete()
            .then((res) => console.log("delete success", res));
    }
};

const resumedTestThunk = createAsyncThunk(
    "resumedTestThunk",
    async ({ type }: IRes, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { currentTopicId } = state.gameReducer;

        if (type === "diagnosticTest") {
            const data = await db?.testQuestions
                ?.where("gameMode")
                .equals(type)
                .first();

            if (data) {
                deleteDataQuestion(currentTopicId);
                deleteDataUser(currentTopicId);
                return {
                    remainTime: 60,
                    listQuestion: data?.question,
                };
            }
        } else {
            deleteDataUser(currentTopicId);
        }
        return undefined;
    }
);

export default resumedTestThunk;

export const updateTimeTest = createAsyncThunk(
    "updateTimeTest",
    async ({}, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { currentTopicId } = state.gameReducer;
        await db?.testQuestions
            .where("parentId")
            .equals(currentTopicId)
            .modify((item) => {
                item.startTime = new Date().getTime();
            });
    }
);
