import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

export interface ITimeTestItem {
    id: string; //id cua bai hoc
    timeTest: number; // thoi gian
}
export interface ITimeTestState {
    data: { [id: string]: ITimeTestItem };
}

export const timeTestSlice = createSlice({
    name: "timeTest",
    initialState: { data: {} },
    reducers: {
        setTimeTest: (state, action: PayloadAction<{ timeTest: number; id: string }>) => {
            let id = action.payload.id;
            let timeTest = action.payload.timeTest;
            if (timeTest && id) {
                if (!!state.data[id]) {
                    // neu da ton tai data ve phan test nay thi upadte lai gia tri
                    state.data[id].timeTest = timeTest;
                } else {
                    // neu chua co thi bo sung vao
                    state.data[id] = { id: id, timeTest: timeTest };
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let data = action["payload"]["timeLeftReducer"]["data"];
                state.data = data;
            }
        });
    },
});

export const { setTimeTest } = timeTestSlice.actions;
export default timeTestSlice.reducer;
