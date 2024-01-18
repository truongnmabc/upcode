import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Question from '../../models/question'
import { QuestionRepo } from '../../repos/question'

export interface QuestionState {
    loading: boolean
    mapQuestion: Map<string, Question>
    mapParentQuestion: Map<string, string[]>
    error?: any
}

export const getQuestionsByTopicId = createAsyncThunk("question/getQuestionsByTopicId", async (courseId: string, { rejectWithValue }) => {
    return await QuestionRepo.getQuestionsByTopicId(courseId).catch(rejectWithValue);
});

export const updateQuestions = createAsyncThunk("question/updateQuestions", async (questions: Question[], { rejectWithValue }) => {
    return await QuestionRepo.updateQuestions(questions).catch(rejectWithValue);
});

export const questionSlice = createSlice({
    name: 'question',
    initialState: {
        loading: false,
        mapParentQuestion: new Map(),
        mapQuestion: new Map()
    } as QuestionState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getQuestionsByTopicId.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getQuestionsByTopicId.fulfilled, (state, action) => {
            state.loading = false;
            for(const topic of action.payload) {
                state.mapQuestion.set(topic.id, topic);
                if(!state.mapParentQuestion.has(topic.courseId)) {
                    state.mapParentQuestion.set(topic.courseId, []);
                }
                state.mapParentQuestion.get(topic.courseId)!.push(topic.id);
            }
        });
        builder.addCase(getQuestionsByTopicId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
        builder.addCase(updateQuestions.fulfilled, (state, action) => {
            for(const question of action.payload) {
                state.mapQuestion.set(question.id, question);
                if(!state.mapParentQuestion.has(question.courseId)) {
                    state.mapParentQuestion.set(question.courseId, []);
                }
                state.mapParentQuestion.get(question.courseId)!.push(question.id);
            }
        });
    }
});

export const filterQuestionsByTopicId = (state: QuestionState, parentId: string) => {
    const list: Question[] = [];
    for(const id of state.mapParentQuestion.get(parentId) ?? []) {
        if(state.mapQuestion.has(id)) {
            list.push(state.mapQuestion.get(id)!);
        }
    }
    return list;
}

export default questionSlice.reducer;

