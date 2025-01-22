"use client";
import { IStatusAnswer } from "@/components/statusAnswer";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestion } from "@/models/question/questions";
import { ITopicQuestion } from "@/models/question/topicQuestion";
import { RootState } from "@/redux/store";
import { requestGetData } from "@/services/request";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IInitQuestion = {
    subTopicTag: string;
    partTag: string;
    partId?: number;
    subTopicId?: number;
    isReset?: boolean;
};

interface IResInitQuestion {
    progressData?: IUserQuestionProgress[] | null | undefined;
    questions?: IQuestion[];
    id: number;
    parentId: number;
    gameMode: "learn" | "test";
}

/**
 * Fetches question data from the database or API.
 * @param {IInitQuestion} params - The parameters for fetching questions.
 * @return {Promise<IResInitQuestion>} The processed question data.
 */
const fetchQuestions = async ({
    subTopicTag,
    partTag,
    ...rest
}: IInitQuestion): Promise<IResInitQuestion> => {
    const res = await db?.topicQuestion
        .where("[subTopicTag+tag]")
        .equals([subTopicTag, partTag])
        .first();
    let progressData: IUserQuestionProgress[] = [];
    const { partId, subTopicId, isReset } = rest;

    if (!res) {
        const data = (await requestGetData({
            url: `api/question/get-questions-by-part-id?partId=${partId}`,
            config: {
                baseURL:
                    "https://api-cms-v2-dot-micro-enigma-235001.appspot.com",
            },
        })) as IQuestion[];

        return {
            questions: data.map((item) => ({
                ...item,
                text: item.text,
                explanation: item.explanation,
                localStatus: "new",
            })),
            progressData: [],
            id: partId || 0,
            parentId: subTopicId || 0,
            gameMode: "learn",
        };
    }

    if (res?.id) {
        console.log("🚀 ~ res:", res);
        progressData =
            (await db?.userProgress
                .filter(
                    (item) =>
                        item.gameMode === "learn" &&
                        item.parentIds.includes(res.id)
                )
                .toArray()) || [];

        console.log("🚀 ~ progressData:", progressData);
    }

    return processQuestions(res, progressData, isReset);
};

/**
 * Processes the fetched question data.
 * @param {ITopicQuestion} res - The database response.
 * @param {IUserQuestionProgress[]} progressData - The progress data.
 * @param {boolean} isReset - Flag to reset progress.
 * @return {IResInitQuestion} The processed question data.
 */
const processQuestions = (
    res: ITopicQuestion,
    progressData: IUserQuestionProgress[],
    isReset?: boolean
): IResInitQuestion => {
    const questions = isReset
        ? res.questions?.map((item) => ({
              ...item,
              localStatus: "new" as IStatusAnswer,
          }))
        : res.questions?.map((que) => {
              const progress = progressData.find((pro) => que.id === pro.id);
              const selectedAnswers = progress?.selectedAnswers || [];

              return {
                  ...que,
                  selectedAnswer: progress
                      ? selectedAnswers[selectedAnswers.length - 1]
                      : null,
                  localStatus: (!progress
                      ? "new"
                      : selectedAnswers.find((pro) => pro.correct)
                      ? "correct"
                      : "incorrect") as IStatusAnswer,
              };
          });

    return {
        questions,
        progressData: isReset ? [] : progressData,
        id: res.id,
        parentId: res.parentId,
        gameMode: "learn",
    };
};

const initLearnQuestionThunk = createAsyncThunk(
    "initLearnQuestionThunk",
    fetchQuestions
);
export default initLearnQuestionThunk;

/**
 * Handles initializing the learn question state.
 * @param {RootState["gameReducer"]} state - The current game state.
 * @param {IResInitQuestion} payload - The new question data.
 */
export const handleInitLearnQuestion = (
    state: RootState["gameReducer"],
    payload: IResInitQuestion
) => {
    const { progressData, questions, id, parentId, gameMode } = payload;
    state.gameMode = gameMode;
    if (!questions || questions.length === 0) {
        console.error("Questions data is undefined or empty!");
        return;
    }

    state.listQuestion = questions;
    state.currentTopicId = id;
    state.currentSubTopicProgressId = parentId;

    if (!progressData || progressData.length === 0) {
        initializeNewState(state, questions);
    } else {
        updateExistingState(state, questions, progressData);
    }
};

/**
 * Initializes the state when no progress data exists.
 * @param {RootState["gameReducer"]} state - The game state.
 * @param {IQuestion[]} questions - The list of questions.
 */
const initializeNewState = (
    state: RootState["gameReducer"],
    questions: IQuestion[]
) => {
    state.currentQuestionIndex = 0;
    state.currentGame = questions[0];
    state.isFirstAttempt = true;
};

/**
 * Updates the state based on existing progress data.
 * @param {RootState["gameReducer"]} state - The game state.
 * @param {IQuestion[]} questions - The list of questions.
 * @param {IUserQuestionProgress[]} progressData - The user's progress data.
 */
const updateExistingState = (
    state: RootState["gameReducer"],
    questions: IQuestion[],
    progressData: IUserQuestionProgress[]
) => {
    const firstUnansweredIndex = questions.findIndex(
        (question) =>
            !progressData.some((answer) => answer?.id === question?.id)
    );

    if (firstUnansweredIndex === -1) {
        handleAllQuestionsAnswered(state, questions, progressData);
    } else {
        state.incorrectQuestionIds = progressData
            .filter((item) => !item.selectedAnswers?.some((ans) => ans.correct))
            .map((item) => item.id);
        state.currentQuestionIndex = firstUnansweredIndex;
        state.currentGame = {
            ...state.listQuestion[firstUnansweredIndex],
            localStatus: "new",
            selectedAnswer: null,
        };
    }
};

/**
 * Handles the state when all questions have been answered once.
 * @param {RootState["gameReducer"]} state - The game state.
 * @param {IQuestion[]} questions - The list of questions.
 * @param {IUserQuestionProgress[]} progressData - The user's progress data.
 */
const handleAllQuestionsAnswered = (
    state: RootState["gameReducer"],
    questions: IQuestion[],
    progressData: IUserQuestionProgress[]
) => {
    const wrongAnswers = questions.filter(
        (question) =>
            !progressData.some(
                (answer) =>
                    answer.id === question?.id &&
                    answer.selectedAnswers?.some((ans) => ans.correct)
            )
    );

    state.isFirstAttempt = false;
    state.currentGame = {
        ...wrongAnswers[0],
        localStatus: "new",
        selectedAnswer: null,
    };
    state.currentQuestionIndex = questions.findIndex(
        (item) => item?.id === wrongAnswers[0]?.id
    );
    state.incorrectQuestionIds = wrongAnswers.map((item) => item.id);
};
