import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IRes = {
    testId?: number;
};

const tryAgainDiagnosticThunk = createAsyncThunk(
    "tryAgainDiagnosticThunk",
    async ({ testId }: IRes, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { listQuestion, idTopic, turn } = state.gameReducer;
        let questions: ICurrentGame[] = [];
        let currentTurn = 1;
        const id = idTopic !== -1 ? idTopic : testId || -1;

        if (listQuestion.length) {
            questions = listQuestion;
            currentTurn = turn;
        } else {
            const list = await db?.testQuestions
                .where("parentId")
                .equals(id)
                .first();
            if (list) {
                currentTurn = list.turn;
                questions = list?.question;
            }
        }

        return {
            listQuestion: questions?.map((item) => ({
                ...item,
                localStatus: "new" as const,
                selectedAnswer: null,
            })),
            turn: currentTurn,
        };
    }
);

export default tryAgainDiagnosticThunk;
