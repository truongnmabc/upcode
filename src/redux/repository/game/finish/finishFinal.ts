"use client";
import { db } from "@/db/db.model";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const finishFinalThunk = createAsyncThunk(
    "finishFinalThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { idTopic } = state.gameReducer;
        try {
            await db?.testQuestions
                .where("parentId")
                .equals(idTopic)
                .modify((item) => {
                    item.turn = item.turn + 1;
                    item.remainTime = item.duration * 60;
                    item.isPaused = false;
                })
                .then((res) => console.log("res", res))
                .catch((err) => console.log("err", err));
        } catch (error) {
            console.error("Error in finishQuestionThunk:", error);
        }
    }
);

export default finishFinalThunk;
