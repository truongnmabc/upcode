import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { REHYDRATE } from "redux-persist";
import Topic from "@/models/Topic";

export interface ITestInforV4State {
    list: Topic[];
}

export const topicSlice = createSlice({
    name: "topic",
    initialState: { list: [] },
    reducers: {},
    extraReducers: (builder) => {
        //TODO
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let list = action["payload"]["topicReducer"]["list"];
                if (list) {
                    state.list = list.map((t) => {
                        return new Topic(t);
                    });
                }
            }
            return state;
        });

        // case Types.GET_TOPICS_BY_PARENT_ID_SUCCESS: {
        //     action.data?.forEach((topic) => {
        //         topic = new Topic(topic);
        //         let a = JSON.parse(JSON.stringify(state.list)).map((t) => new Topic(t));
        //         let indexTopic = a.findIndex((t) => t.id + "" == topic.id + "");
        //         if (indexTopic == -1) {
        //             a.push(topic);
        //         } else {
        //             a[indexTopic] = topic;
        //         }
        //         state.list = a;
        //     });
        //     return { ...state, loading: false, error: null };
        // }
    },
});

export default topicSlice.reducer;
