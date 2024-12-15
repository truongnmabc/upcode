import { ICurrentGame } from "@/redux/features/game";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";

type IRes = {
    nextLever: number;
    nextQuestion: ICurrentGame;
    isFirst: boolean;
};
const nextQuestionThunk = createAsyncThunk(
    "nextQuestionThunk",
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
            console.log("lam lai lan 2");
            console.log("🚀 ~ listWrongAnswers:", listWrongAnswers);

            const indexQuestion = listQuestion.findIndex(
                (item) => item.id === idQuestionInCorrect
            );
            console.log("🚀 ~ indexQuestion:", indexQuestion);

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
    }
);

export default nextQuestionThunk;
