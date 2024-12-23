import { ICurrentGame } from "@/models/game/game";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { RootState } from "@/redux/store";

export const handleInitTestQuestion = (
    state: RootState["gameReducer"],
    payload: {
        progressData: IUserQuestionProgress[];
        questions: ICurrentGame[];
        type: "test" | "learn";
        idTopic: number;
        duration: number;
        isPaused: boolean;
        remainTime: number;
    }
) => {
    const {
        progressData,
        questions,
        type,
        idTopic,
        duration,
        isPaused,
        remainTime,
    } = payload;

    state.time = duration;
    state.type = type;
    state.idTopic = idTopic ?? -1;
    state.listQuestion = questions;
    state.isFirst = true;
    state.isPaused = isPaused;
    state.remainTime = remainTime;
    if (!progressData || progressData.length === 0) {
        // *NOTE: Khi người dùng chưa làm thì mặc định chọn câu đầu tiên.
        state.indexCurrentQuestion = 0;
        state.currentGame = questions[0];
    } else {
        const firstUnansweredIndex = questions.findIndex(
            (question) =>
                !progressData.some((answer) => answer?.id === question?.id)
        );
        state.indexCurrentQuestion =
            firstUnansweredIndex > 0 ? firstUnansweredIndex : 0;
        state.currentGame = {
            ...state.listQuestion[firstUnansweredIndex],
            localStatus: "new",
            selectedAnswer: null,
        };
    }
};
