"use client";
import { ICurrentGame, IGameReducer } from "@/models/game/game";
import UserQuestionProgress from "@/models/progress/userQuestionProgress";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import choiceAnswer, {
    processChoiceAnswer,
} from "../repository/game/choiceAnswer/choiceAnswer";
import initCustomTestThunk from "../repository/game/initData/initCustomTest";
import initDiagnosticTestQuestionThunk from "../repository/game/initData/initDiagnosticTest";
import initFinalTestThunk from "../repository/game/initData/initFinalTest";
import initLearnQuestionThunk, {
    handleInitLearnQuestion,
} from "../repository/game/initData/initLearningQuestion";
import initPracticeThunk from "../repository/game/initData/initPracticeTest";
import nextQuestionThunk from "../repository/game/nextQuestion/nextQuestion";
import nextQuestionDiagnosticThunk from "../repository/game/nextQuestion/nextQuestionDiagnosticTest";
import resumedTestThunk from "../repository/game/pauseAndResumed/resumedTest";
import { handleInitTestQuestion } from "../repository/game/utils";
import { reloadStateThunk } from "../repository/utils/reload";
import { RootState } from "../store";
import choiceStartCustomTestThunk from "../repository/game/customTest/choiceStartTest";
import { IAnswer } from "@/models/question/questions";
import { IStatusAnswer } from "@/components/study/contentGroup/mainStudyView/statusAnswer/statusAnswer";

const init = new UserQuestionProgress();

const plateHolder = {
    ...init,
    localStatus: "new" as IStatusAnswer,
    selectedAnswer: null,
    text: "",
    turn: 1,
};

const initGameReducer: IGameReducer = {
    currentGame: plateHolder,
    listQuestion: [],
    passing: 10,
    indexCurrentQuestion: 0,
    idTopic: -1,
    listWrongAnswers: [],
    isFirst: true,
    indexSubTopic: 1,
    subTopicProgressId: -1,
    turn: 1,
    time: -1,
    type: "learn",
    isPaused: false,
    remainTime: -1,
    belowFifty: {},
    aboveFifty: {},
    feedBack: "newbie",
};

export const gameSlice = createSlice({
    name: "game",
    initialState: initGameReducer,
    reducers: {
        setCurrentGame: (state, action: PayloadAction<ICurrentGame>) => {
            state.currentGame = action.payload;
        },
        viewTest: (state, action) => {
            const index = action.payload;
            state.indexCurrentQuestion =
                index + 1 === state.listQuestion?.length ? 0 : index;
            state.currentGame = state.listQuestion[state.indexCurrentQuestion];
        },
        setIndexSubTopic: (state, action) => {
            state.indexSubTopic = action.payload;
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
        startCustomTest: (state, action) => {
            const { listQuestion, time, parentId, feedBack } = action.payload;
            state.listQuestion = listQuestion;
            state.currentGame = listQuestion[0];
            state.idTopic = parentId;
            state.remainTime = time;
            state.indexCurrentQuestion = 0;
            state.turn = 1;
            state.isFirst = true;
            state.feedBack = feedBack;
        },
        resetState: () => {
            return initGameReducer;
        },
        startRandomReview: (state, action) => {
            const { listQuestion } = action.payload;
            state.listQuestion = listQuestion;
            state.currentGame = listQuestion[0];
            state.indexCurrentQuestion = 0;
            state.turn = 1;
            state.isFirst = true;
        },
    },
    extraReducers(builder) {
        builder.addCase(
            nextQuestionDiagnosticThunk.fulfilled,
            (state, action) => {
                if (action.payload) {
                    const { nextLever, listQuestion, indexCurrentQuestion } =
                        action.payload;

                    state.listQuestion = listQuestion;
                    state.currentGame = nextLever;
                    state.indexCurrentQuestion = indexCurrentQuestion;
                    state.remainTime = 60;
                }
            }
        );
        builder.addCase(reloadStateThunk.fulfilled, (state, action) => {
            const { turn } = action.payload;
            state.turn = turn;
        });

        builder.addCase(resumedTestThunk.fulfilled, (state, action) => {
            if (action.payload) {
                const { remainTime, listQuestion } = action.payload;
                state.turn = 1;
                state.remainTime = remainTime;
                state.listQuestion = listQuestion;
                state.currentGame = listQuestion[0];
                state.indexCurrentQuestion = 0;
            }
        });

        builder.addCase(nextQuestionThunk.fulfilled, (state, action) => {
            const data = action.payload;
            state.currentGame = data?.nextQuestion ?? state.listQuestion[0];
            state.isFirst = data?.isFirst ?? true;
            state.indexCurrentQuestion = data?.nextLever ?? 0;
        });

        builder.addCase(choiceAnswer.fulfilled, (state, action) => {
            if (action.payload) {
                processChoiceAnswer(state, action.payload);
            }
        });

        builder.addCase(initPracticeThunk.fulfilled, (state, action) => {
            state.type = "test";

            if (action.payload) {
                handleInitTestQuestion(state, action.payload);
            }
        });

        builder.addCase(initLearnQuestionThunk.fulfilled, (state, action) => {
            if (action.payload) {
                handleInitLearnQuestion(state, action.payload);
            }
        });

        builder.addCase(initFinalTestThunk.fulfilled, (state, action) => {
            state.type = "test";

            if (action.payload) {
                handleInitTestQuestion(state, action.payload);
            }
        });
        builder.addCase(
            choiceStartCustomTestThunk.fulfilled,
            (state, action) => {
                state.type = "test";

                if (action.payload) {
                    handleInitTestQuestion(state, action.payload);
                }
            }
        );
        builder.addCase(initCustomTestThunk.fulfilled, (state, action) => {
            if (action.payload) {
                const { question, isPaused, remainTime } = action.payload;
                state.listQuestion = question;
                state.currentGame = question[0];
                state.remainTime = remainTime;
                state.isPaused = isPaused;
            } else {
                state.listQuestion = [];
                state.currentGame = plateHolder;
                state.isPaused = false;
            }
        });

        builder.addCase(
            initDiagnosticTestQuestionThunk.fulfilled,
            (state, action) => {
                if (action.payload) {
                    const {
                        listQuestion,
                        belowFifty,
                        aboveFifty,
                        isPaused,
                        idTopic,
                        progressData,
                    } = action.payload;
                    handleInitTestQuestion(state, {
                        type: "test",
                        progressData,
                        questions: listQuestion,
                        idTopic,
                        duration: 1,
                        isPaused,
                        remainTime: 60,
                    });
                    if (belowFifty) state.belowFifty = belowFifty;
                    if (aboveFifty) state.aboveFifty = aboveFifty;
                }
            }
        );
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
    startCustomTest,
    resetState,
    setIndexSubTopic,
    viewTest,
    startRandomReview,
} = actions;

export const gameState = (state: RootState) => state.gameReducer;

export default gameReducer;
