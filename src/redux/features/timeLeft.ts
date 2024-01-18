import { createSlice } from "@reduxjs/toolkit";

export interface ITimeTestItem {
    id: string; //id cua bai hoc
    timeTest: number; // thoi gian
}
export interface ITimeTestState {
    loading: boolean;
    data: { [id: string]: ITimeTestItem };
    list: ITimeTestItem[];
    error: any;
}

export const timeTestSlice = createSlice({
    name: "timeTest",
    initialState: { loading: false, data: {}, list: [], error: null },
    reducers: {},
    extraReducers: (builder) => {
        //TODO
        // case Types.SET_TIME_TEST:
        //     state = updateDataToState(action.timeTest, action.id, state);
        //     return { ...state };
    },
});

const updateDataToState = (timeTest: number, id: string, state: ITimeTestState) => {
    if (!!state.data[id]) {
        // neu da ton tai data ve phan test nay thi upadte lai gia tri
        state.data[id].timeTest = timeTest;
    } else {
        // neu chua co thi bo sung vao
        state.data[id] = { id: id, timeTest: timeTest };
    }
    let isExisted = false;
    state.list = state.list.map((item) => {
        if (item.id == id) {
            isExisted = true;
            return { ...item, timeTest: timeTest };
        }
        return item;
    });
    if (!isExisted) {
        state.list.push({ id: id, timeTest: timeTest });
    }
    return state;
};

export default timeTestSlice.reducer;
