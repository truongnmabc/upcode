"use client";
import { db } from "@/db/db.model";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const finishCustomTestThunk = createAsyncThunk(
    "finishCustomTestThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { currentTopicId } = state.gameReducer;
        try {
            await db?.testQuestions
                .where("parentId")
                .equals(currentTopicId)
                .filter((item) => item.status === 0)
                .modify((item) => {
                    item.status = 1;
                });
        } catch (error) {
            console.error("Error in finishQuestionThunk:", error);
        }
    }
);

export default finishCustomTestThunk;
