import { db } from "@/db/db.model";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IRes = {
    testId?: number;
};

const pauseTestThunk = createAsyncThunk(
    "pauseTestThunk",
    async ({ testId }: IRes, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { idTopic } = state.gameReducer;
        const id = testId || idTopic;
        await db?.testQuestions
            .where("parentId")
            .equals(id)
            .modify((item) => {
                item.isPaused = true;
                item.remainTime =
                    item.remainTime -
                    (new Date().getTime() - item.startTime) / 1000;
                item.startTime = new Date().getTime();
            });
    }
);

export default pauseTestThunk;
