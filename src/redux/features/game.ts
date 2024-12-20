"use client";
import { IStatusAnswer } from "@/components/study/contentGroup/mainStudyView/statusAnswer/statusAnswer";
import UserQuestionProgress from "@/models/progress/userQuestionProgress";
import { IAnswer, IQuestion } from "@/models/question/questions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import choiceAnswer from "../repository/game/choiceAnswer";
import initQuestionThunk from "../repository/game/initQuestion";
import initTestQuestionThunk from "../repository/game/initTestQuestion";
import nextQuestionThunk from "../repository/game/nextQuestion";
import { RootState } from "../store";
import { reloadStateThunk } from "../repository/utils/reload";
import initDiagnosticTestQuestionThunk from "../repository/game/initDiagnosticTestQuestion";

export interface ICurrentGame
    extends Omit<
        IQuestion,
        | "createDate"
        | "databaseId"
        | "hasChild"
        | "hint"
        | "image"
        | "lastUpdate"
        | "oldId"
        | "paragraphId"
    > {
    localStatus?: IStatusAnswer;
    selectedAnswer?: IAnswer | null;
    turn?: number;
    tag?: string;
}
const init = new UserQuestionProgress();
export interface IGameReducer {
    currentGame: ICurrentGame;
    listQuestion: ICurrentGame[];
    idTopic: number;
    indexCurrentQuestion: number;
    listWrongAnswers: number[];
    isFirst: boolean;
    subTopicProgressId: number;
    turn: number;
    time: number;
    type: "test" | "learn";
    isPaused: boolean;
    remainTime: number;
}
const initGameReducer: IGameReducer = {
    currentGame: {
        ...init,
        localStatus: "new",
        selectedAnswer: null,
        text: "",
        turn: 1,
    },
    listQuestion: [],

    indexCurrentQuestion: 0,
    idTopic: -1,
    listWrongAnswers: [],
    //  làm lần đầu
    isFirst: true,

    subTopicProgressId: -1,
    turn: 1,
    time: -1,
    type: "learn",
    isPaused: false,
    remainTime: -1,
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
        setTurtGame: (
            state,
            action: PayloadAction<{
                turn: number;
            }>
        ) => {
            state.turn = action.payload.turn;
        },
        startOverGame: (state) => {
            const list = [...state.listQuestion]?.map((item) => ({
                ...item,
                localStatus: "new" as const,
                selectedAnswer: null,
            }));

            state.currentGame = list[0];
            state.listQuestion = list;
            state.indexCurrentQuestion = 0;
            state.turn = 1;
            state.isPaused = false;
            state.remainTime = state.time * 60;
        },
        continueGame: (state) => {
            state.isPaused = false;
        },
        endTest: (state) => {
            state.indexCurrentQuestion = 0;
            state.turn = 1;
            state.isPaused = false;
            state.remainTime = -1;
        },
    },
    extraReducers(builder) {
        builder.addCase(
            initDiagnosticTestQuestionThunk.fulfilled,
            (state, action) => {
                const { listQuestion } = action.payload;

                state.listQuestion = listQuestion;
                state.currentGame = listQuestion[0];
            }
        );

        builder.addCase(reloadStateThunk.fulfilled, (state, action) => {
            state.turn = action.payload.turn;
        });

        builder.addCase(nextQuestionThunk.fulfilled, (state, action) => {
            const data = action.payload;
            state.currentGame = data?.nextQuestion ?? state.listQuestion[0];
            state.isFirst = data?.isFirst ?? true;
            state.indexCurrentQuestion = data?.nextLever ?? 0;
        });

        builder.addCase(choiceAnswer.fulfilled, (state, action) => {
            const { choice, question } = action.payload;

            state.currentGame.selectedAnswer = choice;
            state.currentGame.localStatus = choice.correct
                ? "correct"
                : "incorrect";

            if (!choice.correct) {
                const newArr = [...state.listWrongAnswers];
                if (newArr.length === 1 && !state.isFirst) {
                    // *NOTE: Trường hợp còn 1 câu và trả lời sai
                    const indexRandom = Math.floor(
                        Math.random() * state.listQuestion.length
                    );
                    state.indexCurrentQuestion = indexRandom;
                    state.listQuestion[indexRandom] = {
                        ...state.listQuestion[indexRandom],
                        selectedAnswer: null,
                        localStatus: "new",
                    };
                    newArr.unshift(state.listQuestion[indexRandom].id);
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
                    localStatus: choice.correct ? "correct" : "incorrect",
                };
            }
        });

        builder.addCase(initTestQuestionThunk.fulfilled, (state, action) => {
            if (!action.payload) {
                return;
            }

            const {
                progressData,
                questions,
                type,
                id,
                duration,
                isPaused,
                remainTime,
            } = action.payload;

            state.time = duration;
            state.type = type;
            state.idTopic = id ?? -1;
            state.listQuestion = questions;
            state.isFirst = true;
            state.isPaused = isPaused;
            state.remainTime = remainTime;
            if (!progressData || progressData.length === 0) {
                // *NOTE: Khi người dùng chưa làm thì mặc định chọn câu đầu tiên.
                state.indexCurrentQuestion = 0;
                state.currentGame = questions[0];
            } else {
                const firstUnansweredIndex = questions.findIndex(
                    (question) =>
                        !progressData.some(
                            (answer) => answer?.id === question?.id
                        )
                );
                state.indexCurrentQuestion =
                    firstUnansweredIndex > 0 ? firstUnansweredIndex : 0;
                state.currentGame = {
                    ...state.listQuestion[firstUnansweredIndex],
                    localStatus: "new",
                    selectedAnswer: null,
                };
            }
        });

        builder.addCase(initQuestionThunk.fulfilled, (state, action) => {
            const { progressData, questions, id, parentId, type } =
                action.payload;
            state.type = type;
            if (questions && questions.length > 0) {
                state.listQuestion = questions;
                state.idTopic = id;
                state.subTopicProgressId = parentId;

                if (!progressData || progressData.length === 0) {
                    // *NOTE: Khi người dùng chưa làm thì mặc định chọn câu đầu tiên.
                    state.indexCurrentQuestion = 0;
                    state.currentGame = questions[0];
                    state.isFirst = true;
                } else {
                    // *NOTE: Lấy vị trí câu đầu tiên chưa làm
                    const firstUnansweredIndex = questions.findIndex(
                        (question) =>
                            !progressData.some(
                                (answer) => answer?.id === question?.id
                            )
                    );

                    if (firstUnansweredIndex === -1) {
                        // *NOTE: Nếu đã làm 1 lượt thì quay lại làm câu sai
                        const wrongAnswers = questions.filter(
                            (question) =>
                                !progressData.some(
                                    (answer) =>
                                        answer.id === question?.id &&
                                        answer.selectedAnswers?.some(
                                            (ans) => ans.correct
                                        )
                                )
                        );

                        state.isFirst = false;
                        state.currentGame = {
                            ...wrongAnswers[0],
                            localStatus: "new",
                            selectedAnswer: null,
                        };

                        state.indexCurrentQuestion = questions.findIndex(
                            (item) => item?.id === wrongAnswers[0]?.id
                        );

                        state.listWrongAnswers = wrongAnswers.map(
                            (item) => item.id
                        );
                    } else {
                        // *NOTE: Chưa làm hết
                        state.listWrongAnswers = progressData
                            .filter(
                                (item) =>
                                    !item.selectedAnswers?.some(
                                        (ans) => ans.correct
                                    )
                            )
                            .map((item) => item.id);

                        state.indexCurrentQuestion = firstUnansweredIndex;
                        state.currentGame = {
                            ...state.listQuestion[firstUnansweredIndex],
                            localStatus: "new",
                            selectedAnswer: null,
                        };
                    }
                }
            } else {
                console.error("Questions data is undefined or empty!");
            }
        });
    },
});

const { reducer: gameReducer, actions } = gameSlice;

export const {
    setCurrentGame,
    setListQuestionGames,
    setTurtGame,
    startOverGame,
    continueGame,
    endTest,
} = actions;

export const gameState = (state: RootState) => state.gameReducer;

export default gameReducer;
