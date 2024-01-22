import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import Question from "../../models/Question";

export interface ICardState {
    mapTopicQuestions: { [key: string]: Question[] };
    abc: boolean;
}

export const cardSlice = createSlice({
    name: "card",
    initialState: {
        mapTopicQuestions: {},
        abc: false,
    },
    reducers: {
        getQuestionsDataSuccess: (state, action: PayloadAction<{ parentId: string; questions: Question[] }>) => {
            try {
                if (action["payload"]) {
                    let payload = action["payload"];
                    let questions = payload.questions;
                    let parentId = payload.parentId;
                    questions = questions.map((q) => new Question(q));
                    if (state.mapTopicQuestions) state.mapTopicQuestions[parentId] = questions; // gán đè luôn, chú ý chỗ này!! // gán đè luôn, chú ý chỗ này!!
                }
            } catch (e) {
                console.log("error: ", e);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let mapTopicQuestionsData = action["payload"]["cardReducer"]?.mapTopicQuestions ?? {};
                let _mapTopicQuestionsData = {};
                for (let id in mapTopicQuestionsData) {
                    _mapTopicQuestionsData[id + ""] = mapTopicQuestionsData[id].map((item) => new Question(item));
                }
                state.mapTopicQuestions = _mapTopicQuestionsData;
            }
        });
    },
});

export const { getQuestionsDataSuccess } = cardSlice.actions;

export default cardSlice.reducer;
