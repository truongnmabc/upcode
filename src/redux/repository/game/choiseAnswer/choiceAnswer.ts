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
        const { type, turn, indexCurrentQuestion, idTopic } = state.gameReducer;

        const isEx = await db?.userProgress.get(question.id);
        const data = {
            parentId: type === "learn" ? question.parentId : idTopic,
            selectedAnswers: isEx
                ? [
                      ...(isEx?.selectedAnswers || []),
                      {
                          ...choice,
                          turn: turn,
                      },
                  ]
                : [
                      {
                          ...choice,
                          turn: 1,
                      },
                  ],
            answers: question.answers,
            type: type,
            text: question.text,
            syncStatus: question.syncStatus,
            status: 1,
            id: question.id,
            level: question.level,
            explanation: question.explanation,
            index: indexCurrentQuestion,
        };

        if (isEx) {
            await db?.userProgress.update(question.id, data).catch((err) => {
                console.log("🚀 db.userProgress.update ~ err:", err);
            });
        } else {
            await db?.userProgress.add(data).catch((err) => {
                console.log("🚀 db.userProgress.add ~ err:", err);
            });
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
        const newArr = [...state.listWrongAnswers];
        if (newArr.length === 1 && !state.isFirst) {
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
};
