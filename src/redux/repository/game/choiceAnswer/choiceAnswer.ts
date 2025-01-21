import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IAnswer } from "@/models/question/questions";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const choiceAnswer = createAsyncThunk(
    "choiceAnswer",
    async (
        { question, choice }: { question: ICurrentGame; choice: IAnswer },
        thunkAPI
    ) => {
        const state = thunkAPI.getState() as RootState;
        const {
            gameMode,
            attemptNumber,
            currentQuestionIndex,
            currentTopicId,
        } = state.gameReducer;

        const parentId =
            gameMode === "learn" ? question.parentId : currentTopicId;
        const isEx = await db?.userProgress.get(question.id);

        const updatedParentIds = isEx?.parentIds
            ? [...new Set([...isEx.parentIds, parentId])]
            : [parentId];

        const updatedSelectedAnswers = isEx
            ? [
                  ...(isEx?.selectedAnswers || []),
                  {
                      ...choice,
                      turn: attemptNumber,
                      parentId,
                  },
              ]
            : [
                  {
                      ...choice,
                      turn: 1,
                      parentId,
                  },
              ];

        const data = {
            parentIds: updatedParentIds,
            selectedAnswers: updatedSelectedAnswers,
            answers: question.answers,
            type: gameMode,
            text: question.text,
            syncStatus: question.syncStatus,
            status: 1,
            id: question.id,
            level: question.level,
            explanation: question.explanation,
            index: currentQuestionIndex,
            image: "",
        };

        if (isEx) {
            await db?.userProgress.update(question.id, data);
        } else {
            await db?.userProgress.add(data);
        }

        return {
            choice,
            question,
        };
    }
);

export default choiceAnswer;

export const processChoiceAnswer = (
    state: RootState["gameReducer"],
    payload: { choice: IAnswer; question: ICurrentGame }
) => {
    const { choice, question } = payload;

    state.currentGame.selectedAnswer = choice;
    state.currentGame.localStatus = choice.correct ? "correct" : "incorrect";

    if (!choice.correct) {
        const newArr = [...state.incorrectQuestionIds];
        if (newArr.length === 1 && !state.isFirstAttempt) {
            const indexRandom = Math.floor(
                Math.random() * state.listQuestion.length
            );
            state.currentQuestionIndex = indexRandom;
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

        state.incorrectQuestionIds = newArr;
    } else {
        state.incorrectQuestionIds = state.incorrectQuestionIds.filter(
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
};
