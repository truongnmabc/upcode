import { IAnswer, IQuestion } from "@/models/question/questions";
import { IStatusAnswer } from "@/components/statusAnswer";
import { IFeedBack } from "@/app/[appShortName]/[state]/custom_test/_components/modalSetting";

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
    turn?: number;
    tag?: string;
    feedBack?: IFeedBack;
    passing?: number;
    image?: string;
    icon?: string;
    type?: "test" | "learn";
}
export interface IGameReducer {
    currentGame: ICurrentGame;
    listQuestion: ICurrentGame[];

    // idTopic: number;
    currentTopicId: number; // ID của chủ đề hiện tại trong game

    // indexCurrentQuestion: number;
    currentQuestionIndex: number; // Vị trí câu hỏi hiện tại trong danh sách

    // incorrectQuestionIds: number[];
    incorrectQuestionIds: number[]; // Danh sách ID câu hỏi làm sai

    // isFirst: boolean;
    isFirstAttempt: boolean; // Lần đầu tiên làm bài hay không

    // subTopicProgressId: number;
    currentSubTopicProgressId: number; // ID tiến trình của sub-topic hiện tại

    // turn: number;
    attemptNumber: number; // Lượt làm bài (lần 1, 2, 3,...)

    // time: number;
    totalDuration: number; // Tổng thời gian của bài test

    // type: "test" | "learn";
    gameMode: "test" | "learn"; // Chế độ của game: learn/test

    // isPaused: boolean;
    isGamePaused: boolean; // Game đang bị tạm dừng hay không

    // indexSubTopic: number;
    currentSubTopicIndex: number; // Vị trí của sub-topic hiện tại trong game

    // passing?: number;
    passingThreshold?: number; // Phần trăm đúng cần để qua bài test

    // isFinishGame?: boolean;
    isGameCompleted?: boolean; // Bài test đã hoàn thành hay chưa?

    // isEndTimeTest?: boolean;
    isTimeUp?: boolean; // Hết thời gian hay chưa?

    // remainTime: number;
    remainingTime: number; // Thời gian còn lại của bài test

    // feedBack?: IFeedBack;
    gameDifficultyLevel: "newbie" | "exam" | "expert"; // Cấp độ bài test (newbie, expert, ...)

    // shouldListenEventKeyboard?: boolean;
    enableKeyboardShortcuts?: boolean; // Có kích hoạt phím tắt không?

    isDataLoaded?: boolean;
}
