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
            .and((item) => item.type === "test")
            .delete()
            .then((res) => console.log("delete success", res));
    }
};

const resumedTestThunk = createAsyncThunk(
    "resumedTestThunk",
    async ({ type }: IRes, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { idTopic } = state.gameReducer;

        if (type === "diagnosticTest") {
            const data = await db?.testQuestions
                ?.where("type")
                .equals(type)
                .first();

            if (data) {
                deleteDataQuestion(idTopic);
                deleteDataUser(idTopic);
                return {
                    remainTime: 60,
                    listQuestion: data?.question,
                };
            }
        } else {
            deleteDataUser(idTopic);
        }
        return undefined;
    }
);

export default resumedTestThunk;
