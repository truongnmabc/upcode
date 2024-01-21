import Question from "../../models/Question";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Config from "@/config";
import { IChoice } from "@/models/Choice";
import Progress from "@/models/Progress";
import AppState from "../appState";
import { getHighhestLevelOfTopicBePassedSequentially, shuffleV4 } from "@/utils/v4_study";
import { hasImage } from "@/utils/v4_question";
import { updateToListGames } from "./listGame";
import { setTimeTestForRestoreGame, setTimeTestForStartNewGame } from "./timeLeft";
import {
    getTestDataFromGoogleStorage,
    getTopicQuestionsFromGoogleStorage,
    readFileAppFromGoogleStorage,
} from "@/services/importAppData";
import { getQuestionsDataSuccess } from "./card";
import { getTopicByParentIdSuccess } from "./topic";
import { getTestSuccess } from "./test";
import TestInfo, { ITestInfo } from "@/models/TestInfo";
import { SYNC_TYPE } from "@/config/config_sync";
import { IAppInfo } from "@/models/AppInfo";
import { ITopic } from "@/models/Topic";
import IWebData from "@/types/webData";
import listAppTopics from "../../data/topic-landing-page.json";

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

export const loadStudyGameThunk = createAsyncThunk(
    "game/loadStudyGame",
    async (action: any, { dispatch, getState, rejectWithValue }) => {
        try {
            const state = getState() as AppState;
            const mapQuestionsData: Map<string, Question[]> = state.cardReducer.mapTopicQuestions;
            const appId: number = state.appInfoReducer.appInfo.appId;
            let studyId = action.studyId;
            let questions = shuffleV4(mapQuestionsData[studyId]);

            // shuffle nhưng đưa câu hỏi không có hình ảnh lên đầu tiên (cải thiện core web vital)
            let normalQuestionIndex: number = questions.findIndex((q) => {
                let isNormal = false;
                if (!q.image || q.image == "null") {
                    // check điều kiện cho match với chỗ này (#####)
                    if (!hasImage(q.question)) isNormal = true;
                }
                return isNormal;
            });

            if (normalQuestionIndex > -1) {
                let tmp = questions[0];
                questions[0] = questions[normalQuestionIndex];
                questions[normalQuestionIndex] = tmp;
            }

            let gameState = GameState.init();
            gameState.id = studyId;
            gameState.gameType = action.gameType;
            gameState.questions = questions.map((q, index) => {
                //suffle các đáp án
                q.choices = shuffleV4(q.choices);
                return {
                    ...q,
                    index: index,
                };
            });
            gameState.currentQuestion = gameState.questions[0];
            gameState.showAnswer = action.gameType == Config.STUDY_GAME;
            gameState.gameTitle = action.gameTitle ?? "";
            gameState.passPercent = action.passPercent;
            gameState.appId = appId;
            gameState.defaultTimeTest = action.defaultTimeTest; // lưu lại giá trị này để restart, trường hợp restore và restart thì vào case khác
            gameState.timeTest = action.defaultTimeTest;
            gameState.levelTag = action.levelTag;

            dispatch(updateToListGames(gameState));
            dispatch(setTimeTestForStartNewGame(gameState));
            return gameState;
        } catch (err) {
            console.log(err);
            return rejectWithValue(null);
        }
    }
);

export const getStudyData = createAsyncThunk(
    "getStudyData",
    async (webData: IWebData, { dispatch, getState, rejectWithValue }) => {
        const state = getState() as AppState;
        // !! check nếu có dữ liệu thì thôi không gọi api, nếu chưa có thì mới gọi
        let [slug, level]: string[] = (webData.slug ?? "").split("#"); // topic có đi kèm phần #level trong url

        let topics: ITopic[] = state.topicReducer.list;
        let mapTopicQuestions: Map<string, Question[]> = state.cardReducer.mapTopicQuestions;
        let appInfo: IAppInfo = state.appInfoReducer.appInfo;
        let tests: ITestInfo[] = state.testReducer.list;
        let lisGameStates: GameState[] = state.listGameReducer.games;
        // phải check xem đã tồn tại dữ liệu chưa thì mới gọi api (vđề là nếu dữ liệu có thay đổi thì không biết được)
        // dữ liệu topic được lưu trong topicV4Reducer.list
        // dữ liệu test lưu trong testInfoV4Reducer.list

        try {
            if (webData.type == SYNC_TYPE.TYPE_LEARN_TEST) {
                let getTopic = false;
                let getTest = false;
                let getTopicQuestions = false;
                let gameType = 0;
                let studyId = "";
                let passPercent = 70;
                let timeTest = 0;
                let topic_tag = "";
                let level_tag = "";
                let forceLoad = false;
                let branchTopic = listAppTopics.find((app) => app.appName === appInfo.appShortName).topics;
                branchTopic = branchTopic.filter((t) => t.isBranch);
                let isBranch = branchTopic.find((t) => t.url === slug);
                let gameTitle = "Full-length " + appInfo.appName + " Practice Test";
                if (isBranch) {
                    gameTitle = isBranch.title;
                }

                // check dữ liệu hiện có ------------------------------------------------------------------------------
                //tạm thời xử lý như này, sau sẽ tổng quát dựa vào dữ liệu trả về từ server
                if (slug == "full-length-" + appInfo.appShortName + "-practice-test" || !!isBranch) {
                    // phần branch dùng chung câu hỏi với test
                    // quy định slug này là vào practice-test
                    // design mới là sẽ chỉ còn 1 bài test ~ diagnosticTest nên testInfoV4Reducer.list chỉ có 1 phần tử thôi
                    gameType = Config.TEST_GAME;
                    let _test = tests.find((t) => t.slug == slug); // tim thong tin bai test (full-test va branch test)
                    if (!_test) {
                        //call api neu nh khong co
                        getTest = true;
                    } else {
                        passPercent = _test.passPercent;
                        timeTest = _test.timeTest;
                        studyId = _test.id + "";
                        // co du lieu roi thi gan du lieu de load game
                        let questionsData = mapTopicQuestions[studyId];
                        if (!questionsData || questionsData.length == 0) {
                            // chua co questions data thi goi api thoi
                            getTest = true;
                        }
                    }
                } else {
                    gameType = Config.STUDY_GAME;
                    let accessTopic = topics.find((t) => slug.includes(t.tag));
                    if (!accessTopic) {
                        // chưa có  thì gọi api
                        getTopic = true;
                    } else if (accessTopic && !accessTopic?.topics) {
                        // là data cũ (không có trường topics) thì gọi api
                        getTopic = true;
                        forceLoad = true;
                    } else {
                        // co du lieu roi thi gan du lieu de load game
                        // update, thêm level thì cần check xem topic đó có lưu level trong trường topics chưa
                        // tìm ra level cao nhất có thể làm rồi đối chiếu với access level
                        // logic là làm theo tuần tự hoặc có thể nhảy cóc sang mini test hoặc final test
                        // coi mini-test và final-test là level và 2 cái này luôn mở khoá
                        // trường hợp vào bằng link không có # hoặc có # nhưng # chưa được mở khoá thì đi vào level cao nhất (THEO TUẦN TỰ) có thể làm trước đó
                        if (accessTopic?.topics.length > 0) {
                            // nếu topic được chia level
                            let maxLevel = getHighhestLevelOfTopicBePassedSequentially(lisGameStates, accessTopic);
                            let highestLevelTopic = accessTopic?.topics.find((t) => t.id === accessTopic.id + "-" + maxLevel);
                            let accessLevelTopic = accessTopic?.topics.find((l) => l.tag === level) ?? highestLevelTopic; // nếu không xác định được level truy cập thì đưa ra level cao nhất theo tuần tự có thể làm
                            if (!(level == "mini-test" || level == "final-test")) {
                                // nếu truy cập vào level lớn hơn level cao nhất có thể làm thì đưa ra level cao nhất theo tuần tự có thể làm
                                let accessLevel = parseInt(accessLevelTopic.id.split("-")[1]);
                                if (accessLevel > maxLevel) accessLevelTopic = highestLevelTopic;
                            }
                            studyId = accessLevelTopic.id + "";
                            topic_tag = accessTopic.tag;
                            level_tag = accessLevelTopic.tag;
                        } else {
                            // trường hợp không chia level
                            studyId = accessTopic.id + "";
                            topic_tag = accessTopic.tag;
                        }
                        gameTitle = appInfo.appName + " " + accessTopic.name + " Practice Test";
                        let questionsData = mapTopicQuestions[studyId];
                        if (!questionsData || questionsData.length == 0) {
                            // chua co questions data thi goi api thoi
                            getTopicQuestions = true;
                        }
                    }
                }
                // restore dữ liệu cũ -----------------------------------------------------------------------------
                if (studyId && !forceLoad) {
                    // qua kiểm tra thấy có id của phần học ứng với slug này rồi thì check trong listGameState (xem đã từng làm chưa) để resotre lại dữ liệu
                    // mặc định coi nếu k có id thì coi như là k có data tải lại từ đầu! (về logic thì đúng)
                    let gameState = lisGameStates.find((game) => {
                        return game.id == studyId;
                    });
                    let timeTestReducer = state.timeLeftReducer.data;
                    let _timeTest = timeTestReducer[studyId]?.timeLeft ?? 0;
                    if (gameState) {
                        // có rồi thì restore lại thôi
                        gameState.levelTag = level_tag; // gán lại chỗ này cho quá trình dev thôi
                        if (gameType == Config.STUDY_GAME) window.location.href = slug + "#" + level_tag; // vì chỗ này đặt return nên phải thêm 1 dòng này ở đây
                        gameState.timeTest = _timeTest;
                        dispatch(restoreGameState(gameState));
                        dispatch(setTimeTestForRestoreGame(gameState));
                        return {};
                    }
                }

                // lấy dữ liệu mới ------------------------------------------------------------------------------
                if (getTest) {
                    // vi api tra ve ca data cua test va question luon nen dung chung 1 bien getTest de check
                    let _test = await getTestDataFromGoogleStorage(appInfo.appShortName, isBranch ? slug : "");

                    let test = new TestInfo(_test[0]);
                    test.slug = slug;
                    studyId = test.id + "";
                    passPercent = test.passPercent;
                    timeTest = test.timeTest;
                    let questionsData = _test[0].cards;
                    if (questionsData.length) {
                        // update vao redux; cho nay can chu y check truong hop co data nhung khong du so luong!!
                        dispatch(getQuestionsDataSuccess({ parentId: studyId, questions: questionsData }));
                    } else
                        throw {
                            err: "Topic question reponse by api is empty!",
                        };
                    dispatch(getTestSuccess([test]));
                }
                if (getTopic) {
                    // mặc định coi vào trường hợp này là tải dữ liệu mới về => vào level thấp nhất
                    let data: any = await readFileAppFromGoogleStorage(""); // get data ve
                    topics = data?.topics ?? [];
                    // topics = topics.map((t) => new Topic(t));
                    dispatch(getTopicByParentIdSuccess(topics));
                    let accessTopic = topics.find((t) => slug.includes(t.tag));
                    if (!accessTopic) {
                        // neu khong tim thay topic dang truy cap
                        throw { err: "No topic data!" };
                    }
                    gameTitle = appInfo.appName + " " + accessTopic.name + " Practice Test";
                    topic_tag = accessTopic.tag;
                    if (!accessTopic?.topics || accessTopic?.topics.length == 0) {
                        // truong hop topic khong chia level
                        studyId = accessTopic.id;
                    } else {
                        // có chia level thì cần tìm ra level thấp nhất của topic
                        let lowestLevel = parseInt(accessTopic.topics[0].id.split("-")[1]);
                        level_tag = accessTopic.topics[0].tag;
                        for (let lv of accessTopic.topics) {
                            let _lv = parseInt((lv.id ?? "").split("-")[1]); // nếu có lỗi ở đây thì try catch r nha
                            if (_lv < lowestLevel) {
                                lowestLevel = _lv;
                                level_tag = lv.tag;
                            }
                        }
                        studyId = accessTopic.id + "-" + lowestLevel;
                    }
                    // check xem data question co chua; cho nay can chu y check truong hop co data nhung khong du so luong!!
                    let topicQuestions = mapTopicQuestions[studyId];
                    if (!topicQuestions || topicQuestions?.length == 0) {
                        // neu chua co
                        getTopicQuestions = true;
                    }
                }
                if (level_tag && gameType == Config.STUDY_GAME) {
                    window.location.href = slug + "#" + level_tag;
                }
                if (getTopicQuestions) {
                    //chua co topic questions data
                    let questionsData: any = await getTopicQuestionsFromGoogleStorage(
                        appInfo.appShortName,
                        topic_tag + (level_tag ? "-" + level_tag : "")
                    );

                    if (questionsData?.length) {
                        // update vao redux
                        dispatch(getQuestionsDataSuccess({ parentId: studyId, questions: questionsData }));
                    } else
                        throw {
                            err: "Topic question reponse by api is empty!",
                        };
                }
                //load game mới hoàn toàn
                dispatch(
                    loadStudyGameThunk({
                        gameType,
                        studyId,
                        passPercent,
                        defaultTimeTest: timeTest,
                        gameTitle,
                        levelTag: level_tag,
                    })
                );
            }
        } catch (e) {
            console.log(e);
        }
        return {};
    }
);

export const gameSlice = createSlice({
    name: "game",
    initialState: GameState.init(),
    reducers: {
        restoreGameState: (state, action: PayloadAction<GameState>) => {
            let rState = new GameState(action.payload);
            if (rState.arrayIndexWrong.length) {
                // cần xử lý đoạn này để tránh trường hợp bug đã làm đúng rồi nhưng vì lý do nào đó mà không update lại arrayIndexWrong thì reload lại để giải quyết
                rState.arrayIndexWrong = [];
                for (let i = 0; i < rState.questions.length; i++) {
                    let isWrongAnswer = false;
                    for (let c of rState.questions[i].choices) {
                        if (c.isCorrect && !c.selected) isWrongAnswer = true;
                    }
                    if (isWrongAnswer) rState.arrayIndexWrong.push(i);
                }
            }
            rState.isLoadedStudyData = true;
            state = rState;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadStudyGameThunk.fulfilled, (state, action) => {
            state = { ...action.payload, isLoadedStudyData: true };
        });
        builder
            .addCase(getStudyData.pending, (state) => {
                state.isLoadedStudyData = false;
                console.log("Pending");
                return state;
            })
            .addCase(getStudyData.fulfilled, (state) => {
                console.log("fullled");
                return state;
            })
            .addCase(getStudyData.rejected, (state, action) => {
                console.log(action.error);
                return state;
            });
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

export const { restoreGameState } = gameSlice.actions;
export default gameSlice.reducer;
