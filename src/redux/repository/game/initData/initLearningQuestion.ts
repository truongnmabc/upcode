"use client";
import { IStatusAnswer } from "@/components/study/contentGroup/mainStudyView/statusAnswer/statusAnswer";
import { db } from "@/db/db.model";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { IQuestion } from "@/models/question/questions";
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
    type: "learn" | "test";
}

const initLearnQuestionThunk = createAsyncThunk(
    "initLearnQuestionThunk",
    async ({
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
                type: "learn",
            };
        }

        if (res?.id) {
            progressData =
                (await db?.userProgress
                    .where("parentId")
                    .equals(res?.id)
                    .filter((item) => item.type === "learn")
                    .toArray()) || [];
        }

        const question = isReset
            ? res.questions?.map((item) => ({
                  ...item,
                  localStatus: "new" as IStatusAnswer,
              }))
            : res?.questions?.map((que) => {
                  const progress = progressData?.find(
                      (pro) => que.id === pro.id
                  );

                  const selectedAnswers = progress?.selectedAnswers || [];

                  return {
                      ...que,
                      selectedAnswer: !progress
                          ? null
                          : selectedAnswers[selectedAnswers?.length - 1],
                      localStatus: (!progress
                          ? "new"
                          : selectedAnswers?.find((pro) => pro.correct)
                          ? "correct"
                          : "incorrect") as IStatusAnswer,
                  };
              });

        const result = {
            questions: question,
            progressData: isReset ? [] : progressData,
            id: res.id,
            parentId: res.parentId,
            type: "learn" as "learn" | "test",
        };

        return result;
    }
);

export default initLearnQuestionThunk;

export const handleInitLearnQuestion = (
    state: RootState["gameReducer"],
    payload: IResInitQuestion
) => {
    const { progressData, questions, id, parentId, type } = payload;
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
                    !progressData.some((answer) => answer?.id === question?.id)
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

                state.listWrongAnswers = wrongAnswers.map((item) => item.id);
            } else {
                // *NOTE: Chưa làm hết
                state.listWrongAnswers = progressData
                    .filter(
                        (item) =>
                            !item.selectedAnswers?.some((ans) => ans.correct)
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
};
