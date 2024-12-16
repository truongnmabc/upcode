import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { db } from "@/db/db.model";

export interface IUserActions {
  status: "like" | "dislike" | "save";
  questionId: number;
}

const useActionsThunk = createAsyncThunk(
  "useActionsThunk",
  async ({ status, questionId }: IUserActions, { getState }) => {
    const state = getState() as RootState;
    const existingAction = state.userReducer.listActions.find(
      (action) => action.questionId === questionId
    );
    console.log("🚀 ~ existingAction:", existingAction);

    if (
      existingAction &&
      (existingAction.isDisLike ||
        existingAction.isLike ||
        existingAction.isSave)
    ) {
      await db.useActions
        .where("questionId")
        .equals(existingAction.questionId)
        .filter((action) => action.status === status)
        .delete()
        .then(function (deleteCount) {
          console.log("Deleted " + deleteCount + " objects");
        });
    } else {
      await db.useActions.add({
        questionId,
        status,
        userId: -1,
      });
    }

    return { status, questionId };
  }
);

export default useActionsThunk;
