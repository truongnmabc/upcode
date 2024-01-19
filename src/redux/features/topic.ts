import { createSlice } from "@reduxjs/toolkit";

import { REHYDRATE } from "redux-persist";
import Topic from "@/models/Topic";

export interface ITopicState {
    list: Topic[];
}

export const topicSlice = createSlice({
    name: "topic",
    initialState: { list: [] },
    reducers: {
        getTopicByParentIdSuccess: (state, action) => {
            let topics = action.payload.data;
            if (topics) {
                topics.forEach((topic) => {
                    topic = new Topic(topic);
                    let a = JSON.parse(JSON.stringify(state.list)).map((t) => new Topic(t));
                    let indexTopic = a.findIndex((t) => t.id + "" == topic.id + "");
                    if (indexTopic == -1) {
                        a.push(topic);
                    } else {
                        a[indexTopic] = topic;
                    }
                    state.list = a;
                });
            }
        },
    },
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
    },
});

export const { getTopicByParentIdSuccess } = topicSlice.actions;
export default topicSlice.reducer;
