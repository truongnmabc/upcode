"use client";
import UserQuestionProgress from "@/models/progress/userQuestionProgress";
import { IAnswer, IQuestion } from "@/models/question/questions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import initQuestionThunk from "../repository/game/initQuestion";
import { RootState } from "../store";
import nextQuestionThunk from "../repository/game/nextQuestion";
import choiceAnswer from "../repository/game/choiceAnswer";
import initTestQuestionThunk from "../repository/game/initTestQuestion";
import { IStatusAnswer } from "@/components/study/contentGroup/mainStudyView/statusAnswer/statusAnswer";

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
  //  luot lam (nguoi dung co the lam lai)
  turn: number;
  // time test
  time: number;
  // type
  type: "test" | "learn";
  // Data  đã đx chuẩn bị chưa
}
const initGameReducer: IGameReducer = {
  currentGame: {
    ...init,
    localStatus: "new",
    selectedAnswer: null,
    text: "",
  },
  listQuestion: [],

  // vị trí câu hiện tại đang làm
  indexCurrentQuestion: 0,
  idTopic: -1,
  //  danh sách câu trả lời sai
  listWrongAnswers: [],
  //  làm lần đầu
  isFist: true,

  subTopicProgressId: -1,
  turn: 0,
  time: 60,
  type: "learn",
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initGameReducer,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<ICurrentGame>) => {
      state.currentGame = action.payload;
    },
    setListQuestionGames: (state, action: PayloadAction<ICurrentGame[]>) => {
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
      state.currentGame.localStatus = choice.correct ? "correct" : "incorrect";

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
          localStatus: choice.correct ? "correct" : "incorrect",
        };
      }
    });

    // builder.addCase(initTestQuestionThunk.fulfilled, (state, action) => {
    //   state.isFetched = true;
    //   const questions = action.payload.questions;
    //   state.listQuestion = questions;
    //   state.currentGame = questions[0];
    // });

    builder.addCase(initQuestionThunk.fulfilled, (state, action) => {
      console.log("start init question", action.payload);
      const { progressData, questions, id, parentId } = action.payload;
      if (questions && questions.length > 0) {
        state.listQuestion = questions;
        state.idTopic = id;
        state.subTopicProgressId = parentId;

        if (!progressData || progressData.length === 0) {
          // *NOTE: Khi người dùng chưa làm thì mặc định chọn câu đầu tiên.
          state.indexCurrentQuestion = 0;
          state.currentGame = questions[0];
        } else {
          // *NOTE: Lấy vị trí câu đầu tiên chưa làm
          const firstUnansweredIndex = questions.findIndex(
            (question) =>
              !progressData.some((answer) => answer?.id === question?.id)
          );

          if (firstUnansweredIndex === -1) {
            // *NOTE: Nếu đã làm 1 lượt thì quay lại làm câu sai
            const wrongAnswers = questions.filter(
              (question) =>
                !progressData.some(
                  (answer) =>
                    answer.id === question?.id &&
                    answer.selectedAnswers?.some((ans) => ans.correct)
                )
            );

            state.currentGame = {
              ...wrongAnswers[0],
              localStatus: "new",
              selectedAnswer: null,
            };

            state.indexCurrentQuestion = questions.findIndex(
              (item) => item.id === wrongAnswers[0].id
            );

            state.listWrongAnswers = wrongAnswers.map((item) => item.id);
          } else {
            // *NOTE: Chưa làm hết
            state.listWrongAnswers = progressData
              .filter(
                (item) => !item.selectedAnswers?.some((ans) => ans.correct)
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

export const { setCurrentGame, setListQuestionGames } = actions;

export const gameState = (state: RootState) => state.gameReducer;

export default gameReducer;
