"use client";
import { db } from "@/db/db.model";
import { IQuestion } from "@/models/question/questions";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const finishDiagnosticThunk = createAsyncThunk(
    "finishDiagnosticThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { listQuestion, idTopic } = state.gameReducer;
        try {
            await db?.testQuestions
                .where("parentId")
                .equals(idTopic)
                .filter((item) => item.status === 0)
                .modify((item) => {
                    item.status = 1;
                    item.question = listQuestion as IQuestion[];
                })
                .then((res) => console.log("res", res))
                .catch((err) => console.log("err", err));
        } catch (error) {
            console.error("Error in finishQuestionThunk:", error);
        }
    }
);

export default finishDiagnosticThunk;
