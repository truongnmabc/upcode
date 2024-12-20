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
                    item.remainTime -
                    (new Date().getTime() - item.startTime) / 1000;
                item.startTime = new Date().getTime();
            })
            .then((res) => console.log("pauseTestThunk ~ get data db", res))
            .catch((err) => console.log("err", err));
    }
);

export default pauseTestThunk;
