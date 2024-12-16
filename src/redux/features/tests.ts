import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ITestReducer {
    openSubmit: boolean;
}

const initialState: ITestReducer = {
    openSubmit: false,
};
export const TestSlice = createSlice({
    name: "tests",
    initialState,
    reducers: {
        shouldOpenSubmitTest: (state, action) => {
            state.openSubmit = action.payload;
        },
    },
});

export const TestReducer = TestSlice.reducer;
export const { shouldOpenSubmitTest } = TestSlice.actions;
export const TestState = (state: RootState) => state.TestReducer;
