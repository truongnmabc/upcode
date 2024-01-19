import { REHYDRATE } from "redux-persist";
import Question from "../../models/Question";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface ICardState {
    status: string; // example
    mapTopicQuestions: Map<string, Question[]>;
}

export const cardSlice = createSlice({
    name: "card",
    initialState: {
        status: "", // example
        mapTopicQuestions: new Map<string, Question[]>(),
    },
    reducers: {
        getQuestionsDataSuccess: (state, action) => {
            if (action["payload"]) {
                let payload = action["payload"];
                let questions = payload["questions"];
                let parentId = payload["parentId"] + "";
                questions = questions.map((q) => new Question(q));
                state.mapTopicQuestions.set(parentId, questions); // gán đè luôn, chú ý chỗ này!!
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let mapTopicQuestionsData = action["payload"]["cardReducer"]?.mapTopicQuestions ?? {};
                let _mapTopicQuestionsData = new Map<string, Question[]>();
                for (let id in mapTopicQuestionsData) {
                    _mapTopicQuestionsData.set(
                        id + "",
                        mapTopicQuestionsData[id].map((item) => new Question(item))
                    );
                }
                state.mapTopicQuestions = _mapTopicQuestionsData;
            }
            return state;
        });

        //example
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.status = "loading";
            })
            // Pass the generated action creators to `.addCase()`
            .addCase(fetchTodos.fulfilled, (state, action) => {
                // Same "mutating" update syntax thanks to Immer
                state.status = "succeeded";
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = "failed";
            });
    },
});

//example
const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
    // Just make the async request here, and return the response.
    // This will automatically dispatch a `pending` action first,
    // and then `fulfilled` or `rejected` actions based on the promise.
    // as needed based on the
    const res = await axios.get("/todos");
    return res.data;
});

export const { getQuestionsDataSuccess } = cardSlice.actions;

export default cardSlice.reducer;
