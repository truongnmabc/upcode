import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initState = {};

export const userSlice = createSlice({
    name: "user",
    initialState: initState,
    reducers: {},
});

const { reducer: userReducer, actions } = userSlice;

export const {} = actions;

export default userReducer;

export const userState = (state: RootState) => state.userReducer;
