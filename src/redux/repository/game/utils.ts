// import { ICurrentGame } from "@/models/game/game";
// import { RootState } from "@/redux/store";

// interface IProgressData extends Omit<ICurrentGame, "parentId"> {
//     dummyField?: string;
// }

// export const handleInitTestQuestion = (
//     state: RootState["gameReducer"],
//     payload: {
//         progressData: IProgressData[];
//         questions: ICurrentGame[];
//         gameMode: "test" | "learn";
//         idTopic: number;
//         duration: number;
//         isPaused: boolean;
//         remainTime: number;
//     }
// ) => {
//     const {
//         progressData,
//         questions,
//         gameMode,
//         idTopic,
//         duration,
//         isPaused,
//         remainTime,
//     } = payload;

//     state.time = duration;
//     state.gameMode = gameMode;
//     state.idTopic = idTopic ?? -1;
//     state.listQuestion = questions;
//     state.isFirst = true;
//     state.isPaused = isPaused;
//     state.remainTime = remainTime;
//     if (!progressData || progressData.length === 0) {
//         state.indexCurrentQuestion = 0;
//         state.currentGame = questions[0];
//     } else {
//         const firstUnansweredIndex = questions.findIndex(
//             (question) =>
//                 !progressData.some((answer) => answer?.id === question?.id)
//         );
//         state.indexCurrentQuestion =
//             firstUnansweredIndex > 0 ? firstUnansweredIndex : 0;

//         state.currentGame = {
//             ...questions[firstUnansweredIndex],
//             localStatus: "new",
//             selectedAnswer: null,
//         };
//     }
// };

import { ICurrentGame } from "@/models/game/game";
import { RootState } from "@/redux/store";

interface IProgressData extends Omit<ICurrentGame, "parentId"> {
    dummyField?: string;
}

export const handleInitTestQuestion = (
    state: RootState["gameReducer"],
    payload: {
        progressData: IProgressData[];
        questions: ICurrentGame[];
        gameMode: "test" | "learn";
        currentTopicId: number;
        totalDuration: number;
        isGamePaused: boolean;
        remainingTime: number;
        attemptNumber?: number;
    }
) => {
    const {
        progressData,
        questions,
        gameMode,
        currentTopicId,
        totalDuration,
        isGamePaused,
        remainingTime,
        attemptNumber,
    } = payload;

    state.totalDuration = totalDuration;
    state.gameMode = gameMode;
    if (attemptNumber) state.attemptNumber = attemptNumber;
    state.currentTopicId = currentTopicId ?? -1;
    state.listQuestion = questions;
    state.isFirstAttempt = true;
    state.isGamePaused = isGamePaused;
    state.remainingTime = remainingTime;

    if (!progressData || progressData.length === 0) {
        state.currentQuestionIndex = 0;
        state.currentGame = questions[0];
    } else {
        const firstUnansweredIndex = questions.findIndex(
            (question) =>
                !progressData.some((answer) => answer?.id === question?.id)
        );

        state.currentQuestionIndex =
            firstUnansweredIndex > 0 ? firstUnansweredIndex : 0;

        state.currentGame = {
            ...questions[firstUnansweredIndex],
            localStatus: "new",
            selectedAnswer: null,
        };
    }
};
