"use client";
import { ICurrentGame } from "@/models/game/game";
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
import tryAgainDiagnosticThunk from "../repository/game/tryAgain/tryAgainDiagnostic";
import tryAgainPracticesThunk from "../repository/game/tryAgain/tryAgainPractices";
import { handleInitTestQuestion } from "../repository/game/utils";
import { reloadStateThunk } from "../repository/utils/reload";
import { RootState } from "../store";
import { initGameReducer, plateHolderCurrentGame } from "./game.placeholder";

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
            state.currentQuestionIndex = index;
            state.currentGame = state.listQuestion[index];
        },
        setIndexSubTopic: (state, action) => {
            state.currentSubTopicIndex = action.payload;
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
            state.attemptNumber = action.payload.turn;
        },
        setShouldListenKeyboard: (state, action) => {
            state.enableKeyboardShortcuts = action.payload;
        },
        startOverGame: (state) => {
            const list = [...state.listQuestion]?.map((item) => ({
                ...item,
                localStatus: "new" as const,
                selectedAnswer: null,
            }));

            state.currentGame = list[0];
            state.listQuestion = list;
            state.currentQuestionIndex = 0;
            state.attemptNumber = 1;
            state.isGamePaused = false;
            state.remainingTime = state.totalDuration * 60;
        },
        startTryAgainDiagnostic: (state) => {
            console.log("🚀 ~ state:", state);
        },
        continueGame: (state) => {
            state.isGamePaused = false;
        },
        shouldEndTimeTest: (state, action) => {
            state.isTimeUp = action.payload;
        },
        endTest: (state) => {
            state.currentQuestionIndex = 0;
            state.attemptNumber = 1;
            state.isGamePaused = false;
            state.remainingTime = -1;
        },
        startCustomTest: (state, action) => {
            const {
                listQuestion,
                remainingTime,
                parentId,
                gameDifficultyLevel,
                passingThreshold,
                currentSubTopicIndex,
            } = action.payload;
            state.listQuestion = listQuestion;
            state.currentGame = listQuestion[0];
            state.currentTopicId = parentId;
            state.remainingTime = remainingTime;
            state.currentQuestionIndex = 0;
            state.attemptNumber = 1;
            state.isFirstAttempt = true;
            state.gameDifficultyLevel = gameDifficultyLevel;
            state.passingThreshold = passingThreshold;
            state.currentSubTopicIndex = currentSubTopicIndex;
        },

        resetState: () => {
            return initGameReducer;
        },
        startRandomReview: (state, action) => {
            const { listQuestion } = action.payload;
            state.listQuestion = listQuestion;
            state.currentGame = listQuestion[0];
            state.currentQuestionIndex = 0;
            state.attemptNumber = 1;
            state.isFirstAttempt = true;
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
                    state.currentQuestionIndex = indexCurrentQuestion;
                    state.remainingTime = 80;
                }
            }
        );

        builder.addCase(reloadStateThunk.fulfilled, (state, action) => {
            const { attemptNumber } = action.payload;
            state.attemptNumber = attemptNumber;
        });

        builder.addCase(resumedTestThunk.fulfilled, (state, action) => {
            if (action.payload) {
                const { remainTime, listQuestion } = action.payload;
                state.attemptNumber = 1;
                state.remainingTime = remainTime;
                state.listQuestion = listQuestion;
                state.currentGame = listQuestion[0];
                state.currentQuestionIndex = 0;
            }
        });

        builder.addCase(nextQuestionThunk.fulfilled, (state, action) => {
            const data = action.payload;
            state.currentGame = data?.nextQuestion ?? state.listQuestion[0];
            state.isFirstAttempt = data?.isFirst ?? true;
            state.currentQuestionIndex = data?.nextLever ?? 0;
        });

        builder.addCase(choiceAnswer.fulfilled, (state, action) => {
            if (action.payload) {
                processChoiceAnswer(state, action.payload);
            }
        });

        builder.addCase(initPracticeThunk.fulfilled, (state, action) => {
            state.gameMode = "test";
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
            state.gameMode = "test";

            if (action.payload) {
                handleInitTestQuestion(state, action.payload);
            }
        });

        builder.addCase(
            choiceStartCustomTestThunk.fulfilled,
            (state, action) => {
                state.gameMode = "test";
                if (action.payload) {
                    state.currentSubTopicIndex =
                        action.payload.currentSubTopicIndex;
                    handleInitTestQuestion(state, action.payload);
                }
            }
        );

        builder.addCase(initCustomTestThunk.fulfilled, (state, action) => {
            if (action.payload) {
                handleInitTestQuestion(state, action.payload);
                const { passingThreshold, attemptNumber } = action.payload;
                state.passingThreshold = passingThreshold;
                state.attemptNumber = attemptNumber;
            } else {
                state.listQuestion = [];
                state.currentGame = plateHolderCurrentGame;
                state.isGamePaused = false;
                state.gameMode = "test";
            }
            state.isDataLoaded = true;
        });

        builder.addCase(tryAgainDiagnosticThunk.fulfilled, (state, action) => {
            const { listQuestion, attemptNumber } = action.payload;
            state.currentGame = listQuestion[0];
            state.listQuestion = listQuestion;
            state.currentQuestionIndex = 0;
            state.attemptNumber = attemptNumber + 1;
            state.isGamePaused = false;
            state.remainingTime = state.totalDuration * 80;
        });

        builder.addCase(tryAgainPracticesThunk.fulfilled, (state, action) => {
            const { listQuestion, attemptNumber, remainingTime } =
                action.payload;
            state.currentGame = listQuestion[0];
            state.listQuestion = listQuestion;
            state.currentQuestionIndex = 0;
            state.attemptNumber = attemptNumber + 1;
            state.isGamePaused = false;
            state.remainingTime = remainingTime * 60;
        });

        builder.addCase(
            initDiagnosticTestQuestionThunk.fulfilled,
            (state, action) => {
                if (action.payload) {
                    const {
                        listQuestion,
                        isGamePaused,
                        currentTopicId,
                        progressData,
                    } = action.payload;
                    handleInitTestQuestion(state, {
                        gameMode: "test",
                        progressData,
                        questions: listQuestion,
                        currentTopicId: currentTopicId,
                        totalDuration: 1,
                        isGamePaused: isGamePaused,
                        remainingTime: 80,
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
