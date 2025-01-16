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
                const currentTime = Date.now();
                const elapsedTimeInSeconds =
                    (currentTime - item.startTime) / 1000;
                const remainingTime = item.remainTime - elapsedTimeInSeconds;

                item.isPaused = true;
                item.remainTime = Math.max(remainingTime, 0);
                item.elapsedTime =
                    (item.elapsedTime || 0) + elapsedTimeInSeconds;
                item.startTime = currentTime;
            });
    }
);

export default pauseTestThunk;
