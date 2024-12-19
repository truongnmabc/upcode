import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IRes = {
    testId: number;
};

const pauseTestThunk = createAsyncThunk(
    "pauseTestThunk",
    async ({ testId }: IRes) => {
        await db?.testQuestions
            .where("parentId")
            .equals(testId)
            .modify((item) => {
                item.isPaused = true;
                item.remainTime =
                    item.remainTime - (new Date().getTime() - item.startTime);
            })
            .then((res) => console.log("res", res))
            .catch((err) => console.log("err", err));
    }
);

export default pauseTestThunk;
