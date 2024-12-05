import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const beforeUnLoadThunk = createAsyncThunk(
  "beforeUnLoadThunk",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { optQuery } = state.studyReducer;
    localStorage.setItem("optQuery", JSON.stringify(optQuery));
  }
);

export default beforeUnLoadThunk;
