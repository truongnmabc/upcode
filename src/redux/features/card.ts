import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import Question from "../../models/Question";

export interface ICardState {
    mapTopicQuestions: Map<string, Question[]>;
}

export const cardSlice = createSlice({
    name: "card",
    initialState: {
        mapTopicQuestions: new Map<string, Question[]>(),
    },
    reducers: {
        getQuestionsDataSuccess: (state, action: PayloadAction<{ parentId: string; questions: Question[] }>) => {
            if (action["payload"]) {
                let payload = action["payload"];
                let questions = payload.questions;
                let parentId = payload.parentId;
                questions = questions.map((q) => new Question(q));
                console.log(questions, parentId);
                state.mapTopicQuestions.set(parentId, questions); // gán đè luôn, chú ý chỗ này!!
            }
            return state;
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
    },
});

export const { getQuestionsDataSuccess } = cardSlice.actions;

export default cardSlice.reducer;
