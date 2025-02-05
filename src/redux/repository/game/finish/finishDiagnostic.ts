"use client";
import { db } from "@/db/db.model";
import { ITopicQuestion } from "@/models/question/topicQuestion";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const finishDiagnosticThunk = createAsyncThunk(
    "finishDiagnosticThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { listQuestion, currentTopicId } = state.gameReducer;
        try {
            await db?.testQuestions
                .where("parentId")
                .equals(currentTopicId)
                .filter((item) => item.status === 0)
                .modify((item) => {
                    item.status = 1;
                    item.question = listQuestion as ITopicQuestion[];
                });
        } catch (error) {
            console.error("Error in finishQuestionThunk:", error);
        }
    }
);

export default finishDiagnosticThunk;
