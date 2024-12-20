import { db } from "@/db/db.model";
import { IAnswer } from "@/models/question/questions";
import { ICurrentGame } from "@/redux/features/game";
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
