import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { resetData } from "./dataVersion";

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
        setTimeTest: (
            state,
            action: PayloadAction<{ timeTest: number; id: string }>
        ) => {
            // const id = action.payload.id;
            // const timeTest = action.payload.timeTest;
            // if (timeTest >= 0 && id) {
            //     if (!!state.data[id]) {
            //         // neu da ton tai data ve phan test nay thi upadte lai gia tri
            //         state.data[id].timeTest = timeTest;
            //     } else {
            //         // neu chua co thi bo sung vao
            //         state.data[id] = { id: id, timeTest: timeTest };
            //     }
            // }
        },
    },
    extraReducers: (builder) => {},
});

export const { setTimeTest } = timeTestSlice.actions;
export default timeTestSlice.reducer;
