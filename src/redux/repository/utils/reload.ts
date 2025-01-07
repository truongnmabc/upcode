import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const beforeUnLoadThunk = createAsyncThunk(
    "beforeUnLoadThunk",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { selectedSubTopics, selectedTopics } = state.studyReducer;
        const { type, turn } = state.gameReducer;
        console.log("🚀 ~ turn:", turn);

        localStorage.setItem(
            "optQuery",
            JSON.stringify({
                selectedSubTopics,
                selectedTopics,
                type,
                turn,
            })
        );
    }
);

export default beforeUnLoadThunk;

export const reloadStateThunk = createAsyncThunk("reloadState", async () => {
    const data = localStorage.getItem("optQuery");
    if (data) return JSON.parse(data);
});
