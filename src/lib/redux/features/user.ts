import { createSlice } from "@reduxjs/toolkit";
import useActionsThunk from "../repository/user/actions";
import { RootState } from "../store";

type IListAction = {
  questionId: number;
  isLike: boolean;
  isSave: boolean;
  isDisLike: boolean;
};

type IUserType = {
  listActions: IListAction[];
};

const initState: IUserType = {
  listActions: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(useActionsThunk.fulfilled, (state, action) => {
      const { questionId, status } = action.payload;

      const existingActionIndex = state.listActions.findIndex(
        (item) => item.questionId === questionId
      );

      if (existingActionIndex !== -1) {
        const existingAction = state.listActions[existingActionIndex];
        if (
          (status === "like" && existingAction.isLike) ||
          (status === "dislike" && existingAction.isDisLike) ||
          (status === "save" && existingAction.isSave)
        ) {
          state.listActions.splice(existingActionIndex, 1);
        } else {
          state.listActions[existingActionIndex] = {
            questionId,
            isDisLike: status === "dislike",
            isLike: status === "like",
            isSave: status === "save",
          };
        }
      } else {
        state.listActions.push({
          questionId,
          isDisLike: status === "dislike",
          isLike: status === "like",
          isSave: status === "save",
        });
      }
    });
  },
});

const { reducer: userReducer, actions } = userSlice;

export const {} = actions;

export default userReducer;

export const userState = (state: RootState) => state.userReducer;
