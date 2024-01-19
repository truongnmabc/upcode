import Question from "../../models/Question";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Config from "@/config";
import { IChoice } from "@/models/Choice";
import Progress from "@/models/Progress";

const DEFAULT_TIME_TEST = 0;
export class GameState {
    answeredQuestionIds: number[]; // dùng để check xem câu hỏi đã được trả lời hay chưa (trong cùng 1 lần làm - trường hợp full test có thể chọn lại đáp án khác được) để đặt event tracking
    appId: number; //
    arrayIndexWrong: number[]; //
    currentQuestion: Question; //
    defaultTimeTest: number; //
    gameTitle: string; //
    gameType: number; //
    id: string; // version cũ là id có thành phần level và appId | vesion mới thì k có cái đó mà chỉ còn mỗi studyId thôi ; bổ sung thêm -[level] cho topic
    indexActive: number; //
    isFinish: boolean; //
    isLoadedStudyData: boolean; //
    levelTag: string; //
    listSelected: IChoice[]; //
    passPercent: number; //
    progress: Progress; //
    questions: Question[]; //
    showAnswer: boolean; // trường này để check xem màn học này có cho hiện kết quả hay không
    status: number;
    timeTest: number; //
    constructor(props?: any) {
        if (!!props) {
            this.id = props?.id + "" ?? "-1";
            if (props?.progress) {
                this.progress = new Progress(props.progress);
            } else {
                this.progress = Progress.init();
            }
            this.appId = props?.appId ?? -1;
            this.arrayIndexWrong = props?.arrayIndexWrong ?? [];
            this.currentQuestion = new Question(props.currentQuestion);
            this.gameType = props?.gameType;
            this.indexActive = props?.indexActive ?? 0;
            this.isFinish = !!props?.isFinish;
            this.status = props?.status ?? Config.GAME_STATUS_TESTING;
            this.levelTag = props?.levelTag ?? "";
            this.listSelected = props?.listSelected ?? [];
            this.passPercent = props?.passPercent ?? 0;
            this.questions = [];
            if (props.questions?.length) {
                for (let i = 0; i < props.questions.length; i++) {
                    this.questions.push(new Question(props.questions[i]));
                }
            }
            this.showAnswer = !!props?.showAnswer;
            this.timeTest = props?.timeTest ?? DEFAULT_TIME_TEST;
            this.gameTitle = props?.gameTitle ?? "";
            this.answeredQuestionIds = props?.answeredQuestionIds ?? [];
            this.defaultTimeTest = props.defaultTimeTest;
            this.isLoadedStudyData = false; // được hiểu là khi khởi tạo được gameState thì có nghĩa là đã load dữ liệu xong, hiện đang áp dụng cho phần học
        } else {
            this.indexActive = 0;
            this.progress = Progress.init();
            this.questions = new Array();
            this.answeredQuestionIds = [];
            this.defaultTimeTest = DEFAULT_TIME_TEST;
        }
    }
    static init() {
        let gameState = new GameState({});
        gameState.answeredQuestionIds = [];
        gameState.appId = -1;
        gameState.arrayIndexWrong = new Array();
        gameState.defaultTimeTest = DEFAULT_TIME_TEST;
        gameState.id = "-1";
        gameState.indexActive = 0;
        gameState.isFinish = false;
        gameState.listSelected = new Array();
        gameState.passPercent = 0;
        gameState.questions = new Array();
        gameState.status = Config.GAME_STATUS_TESTING;
        gameState.timeTest = DEFAULT_TIME_TEST;
        return gameState;
    }
    static cloneGameState(clone) {
        return new GameState(clone);
    }
}

export const gameSlice = createSlice({
    name: "game",
    initialState: GameState.init(),
    reducers: {},
    extraReducers: (builder) => {
        // case Types.GET_STUDY_DATA:
        //     return { ...state, isLoadedStudyData: false };
        // case Types.START_NEW_STUDY:
        //     return { ...action.gameState, isLoadedStudyData: true };
        // case Types.GO_TO_QUESTION_SUCCESS:
        //     return {
        //         ...state,
        //         currentQuestion: action.currentQuestion,
        //         indexActive: action.indexActive,
        //         listSelected: action.listSelected,
        //     };
        // case Types.ON_CHOOSE_ANSWER_SUCCESS:
        //     let _state: GameState = action.gameState;
        //     return { ...state, ..._state };
        // case Types.RESTORE_GAME_STATE:
        //     let rState = new GameState(action.gameState);
        //     if (rState.arrayIndexWrong.length) {
        //         // cần xử lý đoạn này để tránh trường hợp bug đã làm đúng rồi nhưng vì lý do nào đó mà không update lại arrayIndexWrong thì reload lại để giải quyết
        //         rState.arrayIndexWrong = [];
        //         for (let i = 0; i < rState.questions.length; i++) {
        //             let isWrongAnswer = false;
        //             for (let c of rState.questions[i].choices) {
        //                 if (c.isCorrect && !c.selected) isWrongAnswer = true;
        //             }
        //             if (isWrongAnswer) rState.arrayIndexWrong.push(i);
        //         }
        //     }
        //     rState.isLoadedStudyData = true;
        //     return rState;
        // case Types.ON_GAME_SUBMITTED_SUCCESS:
        //     return {
        //         ...state,
        //         ...action.gameState,
        //     };
        // case Types.ON_RESTART_GAME_SUCCESS:
        //     return {
        //         ...state,
        //         ...action.gameState,
        //     };
        // case Types.NEXT_QUESTION_SUCCESS:
        //     return {
        //         ...state,
        //         ...action.gameState,
        //     };
    },
});

export const getNumOfCorrectAnswer = (questions: Question[]) => {
    let numOfCorrectAnswer = questions.filter((q) => q.questionStatus == Config.QUESTION_ANSWERED_CORRECT).length;
    return numOfCorrectAnswer;
};
export default gameSlice.reducer;
