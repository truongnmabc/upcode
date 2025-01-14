import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICurrentGame } from "@/models/game/game";
import { RootState } from "@/redux/store";

type IRes = {
    nextLever: number;
    nextQuestion: ICurrentGame;
    isFirst: boolean;
};
const nextQuestionFinalThunk = createAsyncThunk(
    "nextQuestionFinalThunk",
    async (_, thunkAPI): Promise<IRes | undefined> => {
        const state = thunkAPI.getState() as RootState;
        const {
            listQuestion,
            listWrongAnswers,
            isFirst,
            indexCurrentQuestion,
        } = state.gameReducer;

        if (isFirst && indexCurrentQuestion + 1 < listQuestion.length) {
            return {
                nextLever: indexCurrentQuestion + 1,
                nextQuestion: listQuestion[indexCurrentQuestion + 1],
                isFirst: true,
            };
        }

        if (listWrongAnswers.length > 0) {
            const idQuestionInCorrect = listWrongAnswers[0];

            const indexQuestion = listQuestion.findIndex(
                (item) => item.id === idQuestionInCorrect
            );

            return {
                nextLever: indexQuestion,
                nextQuestion: {
                    ...listQuestion[indexQuestion],
                    selectedAnswer: null,
                    localStatus: "new",
                },
                isFirst: false,
            };
        }
        return undefined;
    }
);

export default nextQuestionFinalThunk;
