import { IStatusAnswer } from "@/components/statusAnswer";
import { IGameReducer } from "@/models/game/game";
import UserQuestionProgress from "@/models/progress/userQuestionProgress";

const init = new UserQuestionProgress();

export const plateHolderCurrentGame = {
    ...init,
    localStatus: "new" as IStatusAnswer,
    selectedAnswer: null,
    text: "",
    turn: 1,
};

export const initGameReducer: IGameReducer = {
    currentGame: plateHolderCurrentGame,
    listQuestion: [],
    passingThreshold: 80, // Phần trăm đúng cần để qua bài test
    currentQuestionIndex: 0, // Vị trí câu hỏi hiện tại trong danh sách
    currentTopicId: -1, // ID của chủ đề hiện tại trong game
    incorrectQuestionIds: [], // Danh sách ID câu hỏi làm sai
    isFirstAttempt: true, // Lần đầu tiên làm bài hay không
    isGameCompleted: false, // Bài test đã hoàn thành hay chưa?
    currentSubTopicIndex: 1, // Vị trí của sub-topic hiện tại trong game
    currentSubTopicProgressId: -1, // ID tiến trình của sub-topic hiện tại
    attemptNumber: 1, // Lượt làm bài (lần 1, 2, 3,...)
    totalDuration: -1, // Tổng thời gian của bài test
    gameMode: "learn", // Chế độ của game: learn/test
    isGamePaused: false, // Game đang bị tạm dừng hay không
    isTimeUp: false, // Hết thời gian hay chưa?
    remainingTime: -1, // Thời gian còn lại của bài test
    gameDifficultyLevel: "newbie", // Cấp độ bài test (newbie, expert, ...)
    enableKeyboardShortcuts: true, // Có kích hoạt phím tắt không?
    isDataLoaded: false, // Xác định xem đã load data xong chưa
};
