"use client";
import UserQuestionProgress from "@/lib/models/progress/userQuestionProgress";
import { IAnswer, IQuestion } from "@/lib/models/question/questions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import initQuestionThunk from "../repository/game/initQuestion";
import { RootState } from "../store";
import nextQuestionThunk from "../repository/game/nextQuestion";
import choiceAnswer from "../repository/game/choiceAnswer";

export interface ICurrentGame extends IQuestion {
    localStatus: "unlock" | "pass" | "miss" | "lock";
    selectedAnswer: IAnswer | null;
}
const init = new UserQuestionProgress();
export interface IGameReducer {
    currentGame: ICurrentGame;
    listQuestion: ICurrentGame[];
    idTopic: number;
    indexCurrentQuestion: number;
    listWrongAnswers: number[];
    isFist: boolean;
    subTopicProgressId: number;
}
const initGameReducer: IGameReducer = {
    currentGame: {
        ...init,
        localStatus: "unlock",
        selectedAnswer: null,
        image: "",
        text: "",
    },
    listQuestion: [],
    indexCurrentQuestion: 0,
    idTopic: -1,

    listWrongAnswers: [],
    isFist: true,
    subTopicProgressId: -1,
};

export const gameSlice = createSlice({
    name: "game",
    initialState: initGameReducer,
    reducers: {
        setCurrentGame: (state, action: PayloadAction<ICurrentGame>) => {
            state.currentGame = action.payload;
        },
        setListQuestionGames: (
            state,
            action: PayloadAction<ICurrentGame[]>
        ) => {
            state.listQuestion = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(nextQuestionThunk.fulfilled, (state, action) => {
            const { nextLever, nextQuestion, isFist } = action.payload;
            state.currentGame = nextQuestion;
            state.isFist = isFist;
            state.indexCurrentQuestion = nextLever;
        });

        builder.addCase(choiceAnswer.fulfilled, (state, action) => {
            const { choice, question } = action.payload;

            state.currentGame.selectedAnswer = choice;
            state.currentGame.localStatus = choice.correct ? "pass" : "miss";

            if (!choice.correct) {
                const newArr = [...state.listWrongAnswers];
                if (newArr.length === 1 && !state.isFist) {
                    // *NOTE: Trường hợp còn 1 câu và trả lời sai
                    const indexRandom = Math.floor(
                        Math.random() * state.listQuestion.length
                    );
                    state.indexCurrentQuestion = indexRandom;

                    newArr.push(state.listQuestion[indexRandom].id);
                } else {
                    if (newArr.includes(question.id)) {
                        newArr.shift();
                        newArr.push(question.id);
                    } else {
                        newArr.push(question.id);
                    }
                }

                state.listWrongAnswers = newArr;
            } else {
                state.listWrongAnswers = state.listWrongAnswers.filter(
                    (id) => id !== question.id
                );
            }
            const questionIndex = state.listQuestion.findIndex(
                (q) => q.id === question.id
            );

            if (questionIndex !== -1) {
                state.listQuestion[questionIndex] = {
                    ...state.listQuestion[questionIndex],
                    selectedAnswer: choice,
                    localStatus: choice.correct ? "pass" : "miss",
                };
            }
        });

        builder.addCase(initQuestionThunk.fulfilled, (state, action) => {
            const progressData = action.payload.progressData;

            const questions = Array.isArray(action.payload.questions)
                ? action.payload.questions.map<ICurrentGame>((question) => {
                      return {
                          ...question,
                          localStatus: progressData.find(
                              (item) =>
                                  item.id === question.id &&
                                  item.selectedAnswers?.correct
                          )
                              ? "pass"
                              : progressData.find(
                                    (item) =>
                                        item.id === question.id &&
                                        !item.selectedAnswers?.correct
                                )
                              ? "miss"
                              : "lock",
                          selectedAnswer:
                              progressData.find(
                                  (item) =>
                                      item.id === question.id &&
                                      item.selectedAnswers
                              )?.selectedAnswers || null,
                          parentId: action.payload.id,
                      };
                  })
                : [];

            state.listQuestion = questions;

            state.idTopic = action.payload.id;
            state.subTopicProgressId = action.payload.parentId;

            if (progressData?.length === 0) {
                // *NOTE: Khi người dùng chưa làm thì mặc định chọn câu đầu tiên.

                state.indexCurrentQuestion = 0;
                state.currentGame = {
                    ...questions?.[0],
                    localStatus: "unlock",
                    selectedAnswer: null,
                };
            } else {
                // *NOTE : Lấy vị trí câu đầu tiên chưa làm
                const firstUnansweredIndex = questions.findIndex(
                    (question) =>
                        !progressData.some(
                            (answer) => answer?.id === question?.id
                        )
                );

                // *NOTE : Nếu đã làm 1 lượt thì sẽ quai lại làm câu sai
                if (firstUnansweredIndex === -1) {
                    const wrongAnswers = questions.filter(
                        (question) =>
                            !progressData.some(
                                (answer) =>
                                    answer.id === question?.id &&
                                    answer.selectedAnswers?.correct
                            )
                    );

                    state.currentGame = {
                        ...wrongAnswers?.[0],
                        localStatus: "unlock",
                        selectedAnswer: null,
                    };

                    state.indexCurrentQuestion = questions.findIndex(
                        (item) => item?.id === wrongAnswers[0]?.id
                    );

                    state.listWrongAnswers = wrongAnswers.map(
                        (item) => item?.id
                    );
                    return;
                }

                // *NOTE: Chưa làm hết

                state.listWrongAnswers = progressData
                    .filter((item) => !item?.selectedAnswers?.correct)
                    .map((item) => item.id);

                state.indexCurrentQuestion = firstUnansweredIndex;
                state.currentGame = {
                    ...questions?.[firstUnansweredIndex],
                    localStatus: "unlock",
                    selectedAnswer: null,
                };
            }
        });
    },
});

const { reducer: gameReducer, actions } = gameSlice;

export const { setCurrentGame, setListQuestionGames } = actions;

export const gameState = (state: RootState) => state.gameReducer;

export default gameReducer;
