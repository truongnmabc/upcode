import { REHYDRATE } from "redux-persist";
import Question from "../../models/Question";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ICardState {
    mapTopicQuestions: Map<string, Question[]>;
}

export const cardSlice = createSlice({
    name: "card",
    initialState: {
        mapTopicQuestions: new Map<string, Question[]>(),
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state, action) => {
            console.log("card");

            if (action["payload"]) {
                let mapTopicQuestionsData = action["payload"]["cardReducer"]?.mapTopicQuestions ?? {};
                console.log(mapTopicQuestionsData);
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

        builder.addCase("getQuestionsData", (state, action) => {
            let questions = action["questions"];
            let parentId = action["parentId"] + "";
            questions = questions.map((q) => new Question(q));
            state.mapTopicQuestions[parentId] = questions; // gán đè luôn, chú ý chỗ này!!
            return { ...state };
        });
    },
});

export const getQuestionsData = createAsyncThunk("card/getQuestionsData", async () => {
    return;
});

export default cardSlice.reducer;
