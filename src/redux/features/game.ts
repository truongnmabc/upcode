import Question from "../../models/Question";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Config from "@/config";
import { IChoice } from "@/models/Choice";
import Progress from "@/models/Progress";

const DEFAULT_TIME_TEST = 0;
export class GameState {
    id: string; // version cũ là id có thành phần level và appId | vesion mới thì k có cái đó mà chỉ còn mỗi studyId thôi ; bổ sung thêm -[level] cho topic
    answeredQuestionIds: number[]; // dùng để check xem câu hỏi đã được trả lời hay chưa (trong cùng 1 lần làm - trường hợp full test có thể chọn lại đáp án khác được) để đặt event tracking
    appId: number; //
    arrayIndexWrong: number[]; //
    currentQuestion: Question; //
    defaultTimeTest: number; //
    gameTitle: string; //
    gameType: number; //
    indexActive: number; //
    isFinish: boolean; //
    isLoaded: boolean;
    isLoading: number;
    isLoadedStudyData: boolean; //
    lastChoiceSelectedId: number;
    lastUpdate: number;
    level: number;
    levelTag: string; //
    listSelected: IChoice[]; //
    passPercent: number;
    progress: Progress; //
    questionIds: any[];
    questions: Question[]; //
    showAnswer: boolean; // trường này để check xem màn học này có cho hiện kết quả hay không
    status: number;
    timeTest: number; //
    topicId: number;
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
            this.isLoaded = !!props?.isLoaded;
            this.isLoading = props?.isLoading ?? 1;
            this.lastChoiceSelectedId = -1;
            this.lastUpdate = props?.lastUpdate ?? -1;
            this.level = props?.level ?? -1;
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
            this.status = props?.status ?? Config.GAME_STATUS_TESTING;
            this.timeTest = props?.timeTest ?? DEFAULT_TIME_TEST;
            this.topicId = props?.topicId ?? -1;
            this.gameTitle = props?.gameTitle ?? "";
            this.answeredQuestionIds = props?.answeredQuestionIds ?? [];
            this.defaultTimeTest = props.defaultTimeTest;
            this.isLoadedStudyData = true; // được hiểu là khi khởi tạo được gameState thì có nghĩa là đã load dữ liệu xong, hiện đang áp dụng cho phần học
        } else {
            this.indexActive = 0;
            this.level = -1;
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
        gameState.isLoaded = false;
        gameState.isLoading = 1;
        gameState.lastChoiceSelectedId = -1;
        gameState.lastUpdate = -1;
        gameState.level = -1;
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
        //TODO
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
        //     if (_state.levelTag.includes("level")) {
        //         // phần học topic [level]
        //         let indexActive = _state.indexActive;
        //         if (indexActive == _state.questions.length - 1 && _state.arrayIndexWrong.length == 0) {
        //             // lượt làm đầu tiên (arrayIndexWrong == []) và cần đảm bảo arrayIndexWrong == []
        //             // nếu làm đến câu cuối thì kiểm tra xem còn câu sai phía trước không để add vào arrayIndexWrong để thực hiện làm lại (theo luồng học cũ làm đến khi nào đúng hết thì thôi)
        //             let _arrayIndexWrong: number[] = [];
        //             for (let i = 0; i < _state.questions.length; i++) {
        //                 // let isWrongAnswer = false;
        //                 // for (let c of _state.questions[i].choices) {
        //                 //     if (c.isCorrect && !c.selected) isWrongAnswer = true;
        //                 // }
        //                 if (_state.questions[i].questionStatus == Config.QUESTION_ANSWERED_INCORRECT) _arrayIndexWrong.push(i);
        //             }
        //             // trường hợp chỉ sai duy nhất câu cuối cùng thì add thêm câu trước đó vào nữa (tránh làm lại luôn câu cuối)
        //             // if (_arrayIndexWrong.length == 1) {
        //             //     if (_arrayIndexWrong[0] == indexActive) {
        //             //         if (indexActive - 1 >= 0) _arrayIndexWrong.unshift(indexActive - 1);
        //             //     }
        //             // }
        //             _state.arrayIndexWrong = _arrayIndexWrong;
        //         } else if (_state.arrayIndexWrong.length > 0) {
        //             //không phải lượt làm đầu tiên
        //             // let isWrongAnswer = false;
        //             // for (let c of _state.currentQuestion.choices) {
        //             //     if (c.isCorrect && !c.selected) isWrongAnswer = true;
        //             // }
        //             if (_state.currentQuestion.questionStatus == Config.QUESTION_ANSWERED_INCORRECT) {
        //                 // nếu trả lời sai
        //                 if (_state.arrayIndexWrong.includes(indexActive)) {
        //                     // câu hiện tại đang nằm trong ds các câu đang trả lời sai
        //                     if (_state.arrayIndexWrong.length == 1) {
        //                         // // còn sai đúng 1 câu và vẫn tiếp tục trả lời sai / cái này xử lý trong NEXT_QUESTION rồi
        //                         // // thêm vào 1 câu khác ở trước để ở NEXT_QUESTION lấy ra làm (vì NEXT_QUESTION lấy ra câu đầu tiên trong arrayIndexWrong)
        //                         // let _index = Math.floor(Math.random() * _state.questions.length);
        //                         // if (_index == indexActive) _index--;
        //                         // if (_index < 0) _index = _state.questions.length - 1;
        //                         // _state.arrayIndexWrong.unshift(_index);
        //                     } else {
        //                         // còn nhiều câu sai, và câu hiện tại sẽ là câu đầu tiên trong arrayIndexWrong (logic hiện tại là thế và cần đảm bảo như vậy để tránh bug phát sinh)
        //                         _state.arrayIndexWrong = _state.arrayIndexWrong.filter((i) => i != indexActive);
        //                         _state.arrayIndexWrong.push(indexActive); // thêm vào cuối ds như hàng đợi
        //                     }
        //                 } else {
        //                     // nếu đây là một câu sai mới thì push vào arrayIndexWrong
        //                     _state.arrayIndexWrong.push(indexActive);
        //                 }
        //             } else {
        //                 // trả lời đúng (và câu này sẽ nằm trong arrayIndexWrong - cần đảm bảo nó nằm trong arrayIndexWrong vì rơi vào trường hợp này là đang ở đoạn trả lời lại các câu đã sai)
        //                 _state.arrayIndexWrong = _state.arrayIndexWrong.filter((i) => i != indexActive);
        //             }
        //         }
        //     }
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
