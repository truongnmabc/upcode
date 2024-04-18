import Config from "@/config";
import { IChoice } from "@/models/Choice";
import Progress from "@/models/Progress";
import { createSlice } from "@reduxjs/toolkit";
import Question from "../../models/Question";
import {
    getStudyData,
    goToQuestion,
    nextQuestion,
    onChooseAnswer,
    onGameSubmitted,
    onRestartGame,
} from "../reporsitory/game.repository";

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
    isFinishGame: -1 | 0 | 1; // đánh dấu là đã kết thúc bài học hay chưa {-1: init, 0: chưa, 1: rồi}
    isLoadedStudyData: boolean; //
    levelTag: string; //
    listSelected: IChoice[]; //
    passPercent: number; //
    progress: Progress; //
    questions: Question[]; //
    showAnswer: boolean; // trường này để check xem màn học này có cho hiện kết quả hay không
    status: number;
    timeTest: number; //
    unlock: boolean;
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
            this.isFinishGame = props?.isFinishGame ?? -1;
            if (!!props?.isFinish) this.isFinishGame = 1;
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
        this.unlock = !!props.unlock;
    }
    static init() {
        let gameState = new GameState({});
        gameState.answeredQuestionIds = [];
        gameState.appId = -1;
        gameState.arrayIndexWrong = new Array();
        gameState.defaultTimeTest = DEFAULT_TIME_TEST;
        gameState.id = "-1";
        gameState.indexActive = 0;
        gameState.isFinishGame = -1;
        gameState.listSelected = new Array();
        gameState.passPercent = 0;
        gameState.questions = new Array();
        gameState.status = Config.GAME_STATUS_TESTING;
        gameState.timeTest = DEFAULT_TIME_TEST;
        return gameState;
    }
    static cloneGameState(clone) {
        let re = new GameState(JSON.parse(JSON.stringify(clone)));
        re.isLoadedStudyData = !!clone?.isLoadedStudyData;
        return re;
    }
}

export const gameSlice = createSlice({
    name: "game",
    initialState: { game: GameState.init() },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStudyData.pending, (state) => {
            state.game.isLoadedStudyData = false;
        });
        builder.addCase(getStudyData.fulfilled, (state, action) => {
            state.game = { ...action.payload };
            state.game.isLoadedStudyData = true;
            if (state.game.isFinishGame == -1) state.game.isFinishGame = 0;
            if (!!state.game.levelTag) state.game.unlock = true; // có dữ liệu game tức là unlock
        });
        builder.addCase(getStudyData.rejected, (state, action) => {
            console.log(action.error);
        });

        builder.addCase(goToQuestion.fulfilled, (state, action) => {
            state.game = action.payload;
        });

        builder.addCase(onChooseAnswer.fulfilled, (state, action) => {
            state.game = action.payload;
        });

        builder.addCase(nextQuestion.fulfilled, (state, action) => {
            state.game = action.payload;
        });

        builder.addCase(onGameSubmitted.fulfilled, (state, action) => {
            state.game = action.payload;
        });

        builder.addCase(onRestartGame.fulfilled, (state, action) => {
            state.game = action.payload;
            if (!!state.game.levelTag) state.game.unlock = true; // có dữ liệu game tức là unlock
        });
    },
});

export const getNumOfCorrectAnswer = (questions: Question[]) => {
    let numOfCorrectAnswer = questions.filter((q) => q.questionStatus == Config.QUESTION_ANSWERED_CORRECT).length;
    return numOfCorrectAnswer;
};

export default gameSlice.reducer;
