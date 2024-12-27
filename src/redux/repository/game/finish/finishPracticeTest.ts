"use client";
import { db } from "@/db/db.model";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const finishPracticeThunk = createAsyncThunk(
    "finishPracticeThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { idTopic } = state.gameReducer;
        try {
            await db?.testQuestions
                .where("parentId")
                .equals(idTopic)
                .filter((item) => item.status === 0)
                .modify((item) => {
                    item.status = 1;
                    item.isPaused = false;
                })
                .then((res) => console.log("res", res))
                .catch((err) => console.log("err", err));
        } catch (error) {
            console.error("Error in finishQuestionThunk:", error);
        }
    }
);

export default finishPracticeThunk;
