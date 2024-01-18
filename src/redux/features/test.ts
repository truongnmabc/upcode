import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { REHYDRATE } from "redux-persist";
import TestInfo from "@/models/TestInfo";

export interface ITestInforV4State {
    list: TestInfo[];
}

export const testSlice = createSlice({
    name: "test",
    initialState: { list: [] },
    reducers: {},
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

        // case Types.GET_TEST_INFO_BY_APP_ID_SUCCESS: {
        //     if (action.testInfos) {
        //         action.testInfos.forEach((el) => {
        //             let testInfo = new TestInfo(el);
        //             let index = state.list.findIndex((t) => t.id == testInfo.id);
        //             if (index == -1) {
        //                 state.list.push(testInfo);
        //             } else {
        //                 state.list[index] = testInfo;
        //             }
        //         });
        //         if (action.forceNew) {
        //             state.list = [...state.list];
        //         }
        //     }
        //     return {
        //         ...state,
        //     };
        // }
    },
});

export default testSlice.reducer;
