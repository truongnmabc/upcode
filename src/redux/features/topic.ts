import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
// import { TopicRepo } from '../../repos/topic'
import Topic from "@/models/Topic";

export interface TopicState {
    loading: boolean;
    mapTopic: Map<string, Topic>;
    mapParentTopic: Map<string, string[]>;
    error?: any;
}

// export const getTopicsByCourseId = createAsyncThunk(
//     "topic/getTopicsByCourseId",
//     async (courseId: string, { rejectWithValue }) => {
//         return await TopicRepo.getTopicsByCourseId(courseId).catch(rejectWithValue);
//     }
// );

// export const getTopic = createAsyncThunk("topic/getTopic", async (topicId: string, { rejectWithValue }) => {
//     return await TopicRepo.getTopic(topicId).catch(rejectWithValue);
// });

// export const updateTopic = createAsyncThunk("topic/updateTopic", async (topic: Topic, { rejectWithValue }) => {
//     return await TopicRepo.updateTopic(topic).catch(rejectWithValue);
// });
export const rehydrate = createAsyncThunk(REHYDRATE, async (data) => {
    return data;
});

export const topicSlice = createSlice({
    name: "topic",
    initialState: {
        loading: false,
        mapParentTopic: new Map(),
        mapTopic: new Map(),
    } as TopicState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(rehydrate.fulfilled, (state, action) => {
            console.log("kkk");
        });
        // builder.addCase(getTopicsByCourseId.pending, (state) => {
        //     state.loading = true;
        // });
        // builder.addCase(getTopicsByCourseId.fulfilled, (state, action) => {
        //     state.loading = false;
        //     for (const topic of action.payload) {
        //         state.mapTopic.set(topic.id, topic);
        //         if (!state.mapParentTopic.has(topic.courseId)) {
        //             state.mapParentTopic.set(topic.courseId, []);
        //         }
        //         state.mapParentTopic.get(topic.courseId)!.push(topic.id);
        //     }
        // });
        // builder.addCase(getTopicsByCourseId.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.error;
        // });
        // builder.addCase(updateTopic.fulfilled, (state, action) => {
        //     const topic = action.payload;
        //     state.mapTopic.set(topic.id, topic);
        //         if(!state.mapParentTopic.has(topic.courseId)) {
        //             state.mapParentTopic.set(topic.courseId, []);
        //         }
        //         state.mapParentTopic.get(topic.courseId)!.push(topic.id);
        // });
        // builder.addCase(getTopic.fulfilled, (state, action) => {
        //     const topic = action.payload;
        //     state.mapTopic.set(topic.id, topic);
        //         if(!state.mapParentTopic.has(topic.courseId)) {
        //             state.mapParentTopic.set(topic.courseId, []);
        //         }
        //         state.mapParentTopic.get(topic.courseId)!.push(topic.id);
        // });
    },
});

export const filterTopicsByCourseId = (state: TopicState, parentId: string) => {
    const list: Topic[] = [];
    for (const id of state.mapParentTopic.get(parentId) ?? []) {
        if (state.mapTopic.has(id)) {
            list.push(state.mapTopic.get(id)!);
        }
    }
    return list;
};

export default topicSlice.reducer;
