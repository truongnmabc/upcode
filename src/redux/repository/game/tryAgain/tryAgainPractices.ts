import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IRes = {
    testId?: number;
};

const tryAgainPracticesThunk = createAsyncThunk(
    "tryAgainPracticesThunk",
    async ({ testId }: IRes, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { listQuestion, currentTopicId, attemptNumber } =
            state.gameReducer;

        let questions: ICurrentGame[] = [];
        let currentTurn = 1;
        let remainingTime = 1;

        const id = currentTopicId !== -1 ? currentTopicId : testId || -1;

        if (listQuestion.length) {
            questions = listQuestion;
            currentTurn = attemptNumber;
        } else {
            const list = await db?.testQuestions
                .where("parentId")
                .equals(id)
                .first();
            if (list) {
                currentTurn = list.attemptNumber;
                questions = list?.question;
                remainingTime = list.remainingTime;
            }
        }

        return {
            listQuestion: questions?.map((item) => ({
                ...item,
                localStatus: "new" as const,
                selectedAnswer: null,
            })),
            attemptNumber: currentTurn,
            remainingTime,
        };
    }
);

export default tryAgainPracticesThunk;
