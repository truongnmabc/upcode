import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { REHYDRATE } from "redux-persist";
import Topic, { ITopic } from "@/models/Topic";

export interface ITopicState {
    list: Topic[];
}

export const topicSlice = createSlice({
    name: "topic",
    initialState: { list: [] },
    reducers: {
        getTopicByParentIdSuccess: (state, action: PayloadAction<ITopic[]>) => {
            let topics = action.payload; // dữ liệu vào đến đây cần được đảm bảo đã convert theo đúng model
            if (topics) {
                let a = JSON.parse(JSON.stringify(state.list)).map((t) => new Topic(t));
                topics.forEach((topic) => {
                    let indexTopic = a.findIndex((t) => t.id + "" == topic.id + "");
                    if (indexTopic == -1) {
                        a.push(topic);
                    } else {
                        a[indexTopic] = topic;
                    }
                });
                state.list = a;
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
        });
    },
});

export const { getTopicByParentIdSuccess } = topicSlice.actions;
export default topicSlice.reducer;
