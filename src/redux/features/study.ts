import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type IQueryOpt = {
  subTopicTag?: string;
  partTag?: string;
};
export interface IStudyReducer {
  selectedTopics: number; // id topic dang chon
  selectedSubTopics: number; // id sub topic dang chon
  optQuery: IQueryOpt;
}
const initStudyReducer: IStudyReducer = {
  selectedTopics: -1,
  selectedSubTopics: -1,
  optQuery: {},
};

export const studySlice = createSlice({
  name: "study",
  initialState: { ...initStudyReducer },
  reducers: {
    selectTopics: (state, action: PayloadAction<number>) => {
      state.selectedTopics = action.payload;
    },
    selectSubTopics: (state, action: PayloadAction<number>) => {
      state.selectedSubTopics = action.payload;
    },
    setOptQuery: (state, action: PayloadAction<IQueryOpt>) => {
      state.optQuery = action.payload;
    },
  },
});

const { reducer: studyReducer, actions } = studySlice;

export default studyReducer;

export const { selectTopics, selectSubTopics, setOptQuery } = actions;

export const studyState = (state: RootState) => state.studyReducer;
