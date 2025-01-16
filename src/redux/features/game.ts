"use client";
import { IStatusAnswer } from "@/components/statusAnswer";
import { ICurrentGame, IGameReducer } from "@/models/game/game";
import UserQuestionProgress from "@/models/progress/userQuestionProgress";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import choiceAnswer, {
    processChoiceAnswer,
} from "../repository/game/choiceAnswer/choiceAnswer";
import choiceStartCustomTestThunk from "../repository/game/choiceAnswer/choiceStartTest";
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
    passing: 80,
    indexCurrentQuestion: 0,
    idTopic: -1, // id current game được, sử dụng để truy vấn, đặt tên hỏi lú tý, sau dùng nhiều ngại sửa
    listWrongAnswers: [],
    isFirst: true,
    isFinishGame: false,
    indexSubTopic: 1,
    subTopicProgressId: -1,
    turn: 1,
    time: -1,
    type: "learn",
    isPaused: false,
    isEndTimeTest: false,
    remainTime: -1,
    feedBack: "newbie",
    shouldListenEventKeyboard: true,
};

export const gameSlice = createSlice({
    name: "game",
    initialState: initGameReducer,
    reducers: {
        setCurrentGame: (state, action: PayloadAction<ICurrentGame>) => {
            state.currentGame = action.payload;
        },
        viewTest: (state, action) => {
            const payload = action.payload;

            const index = payload === state.listQuestion?.length ? 0 : payload;

            state.indexCurrentQuestion = index;
            state.currentGame = state.listQuestion[index];
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
        setShouldListenKeyboard: (state, action) => {
            state.shouldListenEventKeyboard = action.payload;
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
        startTryAgainDiagnostic: (state) => {
            const list = [...state.listQuestion]?.map((item) => ({
                ...item,
                localStatus: "new" as const,
                selectedAnswer: null,
            }));

            state.currentGame = list[0];
            state.listQuestion = list;
            state.indexCurrentQuestion = 0;
            const turn = state.turn;
            state.turn = turn + 1;
            state.isPaused = false;
            state.remainTime = state.time * 80;
        },
        continueGame: (state) => {
            state.isPaused = false;
        },
        shouldEndTimeTest: (state, action) => {
            state.isEndTimeTest = action.payload;
        },
        endTest: (state) => {
            state.indexCurrentQuestion = 0;
            state.turn = 1;
            state.isPaused = false;
            state.remainTime = -1;
        },
        startCustomTest: (state, action) => {
            const { listQuestion, time, parentId, feedBack, passing } =
                action.payload;
            state.listQuestion = listQuestion;
            state.currentGame = listQuestion[0];
            state.idTopic = parentId;
            state.remainTime = time;
            state.indexCurrentQuestion = 0;
            state.turn = 1;
            state.isFirst = true;
            state.feedBack = feedBack;
            state.passing = passing;
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
                    state.remainTime = 80;
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
                    state.indexSubTopic = action.payload.indexSubTopic;
                    handleInitTestQuestion(state, action.payload);
                }
            }
        );
        builder.addCase(initCustomTestThunk.fulfilled, (state, action) => {
            if (action.payload) {
                handleInitTestQuestion(state, action.payload);
                const { passing, turn } = action.payload;
                state.passing = passing;
                state.turn = turn;
            } else {
                state.listQuestion = [];
                state.currentGame = plateHolder;
                state.isPaused = false;
                state.type = "test";
            }
        });

        builder.addCase(
            initDiagnosticTestQuestionThunk.fulfilled,
            (state, action) => {
                if (action.payload) {
                    const { listQuestion, isPaused, idTopic, progressData } =
                        action.payload;
                    handleInitTestQuestion(state, {
                        type: "test",
                        progressData,
                        questions: listQuestion,
                        idTopic,
                        duration: 1,
                        isPaused,
                        remainTime: 80,
                    });
                }
            }
        );
    },
});

const { reducer: gameReducer, actions } = gameSlice;

export const {
    setCurrentGame,
    setListQuestionGames,
    setShouldListenKeyboard,
    setTurtGame,
    startOverGame,
    continueGame,
    endTest,
    startCustomTest,
    resetState,
    setIndexSubTopic,
    viewTest,
    startRandomReview,
    startTryAgainDiagnostic,
    shouldEndTimeTest,
} = actions;

export const gameState = (state: RootState) => state.gameReducer;

export default gameReducer;
