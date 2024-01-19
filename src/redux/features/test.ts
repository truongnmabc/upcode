import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { REHYDRATE } from "redux-persist";
import TestInfo from "@/models/TestInfo";

export interface ITestState {
    list: TestInfo[];
}

export const testSlice = createSlice({
    name: "test",
    initialState: { list: [] },
    reducers: {
        getTestSuccess: (state, action) => {
            if (action.payload.testInfos) {
                action.payload.testInfos.forEach((el) => {
                    let testInfo = new TestInfo(el);
                    let index = state.list.findIndex((t) => t.id == testInfo.id);
                    if (index == -1) {
                        state.list.push(testInfo);
                    } else {
                        state.list[index] = testInfo;
                    }
                });
                if (action.payload.forceNew) {
                    state.list = [...state.list];
                }
            }
        },
    },
    extraReducers: (builder) => {
        //TODO
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let list = action["payload"]["testReducer"]["list"];
                if (list) {
                    let newList = [];
                    list.forEach((t) => {
                        let testInfo = new TestInfo(t);
                        newList.push(testInfo);
                    });
                    state.list = newList;
                }
            }
            return state;
        });
    },
});

export const { getTestSuccess } = testSlice.actions;
export default testSlice.reducer;
