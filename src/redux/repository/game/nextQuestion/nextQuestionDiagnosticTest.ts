import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICurrentGame } from "@/models/game/game";
import { RootState } from "@/redux/store";

type IRes = {
    nextLever: ICurrentGame;
    listQuestion: ICurrentGame[];
    isFirst: boolean;
    indexCurrentQuestion: number;
};

const nextQuestionDiagnosticThunk = createAsyncThunk(
    "nextQuestionDiagnostic",
    async (_, thunkAPI): Promise<IRes | undefined> => {
        const state = thunkAPI.getState() as RootState;
        const { listQuestion, indexCurrentQuestion } = state.gameReducer;

        if (indexCurrentQuestion + 1 < listQuestion.length) {
            return {
                nextLever: listQuestion[indexCurrentQuestion + 1],
                isFirst: true,
                indexCurrentQuestion: indexCurrentQuestion + 1,
                listQuestion: listQuestion,
            };
        } else {
            return undefined;
        }
    }
);

export default nextQuestionDiagnosticThunk;
