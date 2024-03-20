import Config from "@/config";
import { SYNC_TYPE } from "@/config/config_sync";
import { IAppInfo } from "@/models/AppInfo";
import { IChoice } from "@/models/Choice";
import Progress from "@/models/Progress";
import { ITestInfo } from "@/models/TestInfo";
import Topic, { ITopic } from "@/models/Topic";
import {
    getTestDataFromGoogleStorage,
    getTopicQuestionsFromGoogleStorage,
    readFileAppFromGoogleStorage,
} from "@/services/importAppData";
import IWebData from "@/types/webData";
import * as ga from "../../services/ga";
import { hasImage } from "@/utils/v4_question";
import { getHighhestLevelOfTopicBePracticed, shuffleV4 } from "@/utils/v4_study";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Question from "../../models/Question";
import AppState from "../appState";
import { getQuestionsDataSuccess } from "../features/card";
import { GameState } from "../features/game";
import { updateToListGames } from "../features/listGame";
import { getTestSuccess } from "../features/test";
import { setTimeTest } from "../features/timeLeft";
import { getTopicByParentIdSuccess } from "../features/topic";
import { getAppTopics } from "@/utils/getRawTopicsData";
import { DATA_VERSION, resetData } from "../features/dataVersion";

const getStudyData = createAsyncThunk("getStudyData", async (webData: IWebData, { dispatch, getState, rejectWithValue }) => {
    // tại version này phần học đc build static nên các url coi như là được xác định trước rồi!
    const state = getState() as AppState;
    // !! check nếu có dữ liệu thì thôi không gọi api, nếu chưa có thì mới gọi
    let [fullSlug, level]: string[] = (webData.fullSlug ?? "").split("#"); // topic có đi kèm phần #level trong url
    let slashIndex = fullSlug.lastIndexOf("/");
    let slug = fullSlug;
    if (slashIndex !== -1) {
        slug = slug.substring(slashIndex + 1, fullSlug.length);
    }
    let topics: ITopic[] = state.topicReducer.list.map((a) => new Topic(a)); // topic đã được lấy về khi getServerSideProps
    let mapTopicQuestions: { [key: string]: Question[] } = state.cardReducer.mapTopicQuestions;
    let appInfo: IAppInfo = state.appInfoReducer.appInfo;
    let tests: ITestInfo[] = state.testReducer.list; // test đã được lấy về khi getServerSideProps
    let lisGameStates: GameState[] = state.listGameReducer.games.map((g) => new GameState(g));
    let _state = webData._state;
    // phải check xem đã tồn tại dữ liệu chưa thì mới gọi api (vđề là nếu dữ liệu có thay đổi thì không biết được)
    // dữ liệu topic được lưu trong topicV4Reducer.list
    // dữ liệu test lưu trong testInfoV4Reducer.list
    try {
        if (webData.type == SYNC_TYPE.TYPE_LEARN_TEST) {
            let getTopic = false;
            let getTest = false;
            let getTopicQuestions = false;
            let gameType = webData.gameType ?? Config.TOPIC_GAME;
            let studyId = "";
            let passPercent = 70;
            let timeTest = 0;
            let topic_tag = "";
            let level_tag = "";
            let forceLoad = false; // biến này để xử lý trường hợp data cũ và data mới thôi, giờ nó cũng k còn tác dụng nữa nma cứ để đây
            let gameTitle = "Full-length " + appInfo.appName + " Practice Test";

            if (gameType == Config.BRANCH_TEST_GAME) {
                let branchTopic = getAppTopics().find((app) => app.appId === appInfo.appId)?.topics;
                branchTopic = branchTopic?.filter((t) => t.isBranch);
                let branch = branchTopic?.find((t) => t.url === slug);
                gameTitle = branch.title;
            }

            // check dữ liệu hiện có ------------------------------------------------------------------------------
            //tạm thời xử lý như này, sau sẽ tổng quát dựa vào dữ liệu trả về từ server
            if (gameType !== Config.TOPIC_GAME) {
                // phần branch dùng chung câu hỏi với test
                // quy định slug này là vào practice-test
                // design mới là sẽ chỉ còn 1 bài test ~ diagnosticTest nên testInfoV4Reducer.list chỉ có 1 phần tử thôi
                let _test = tests.find((t) => t.slug.includes(slug)); // tim thong tin bai test (full-test va branch test)
                if (!_test) {
                    //call api neu nh khong co
                    getTest = true;
                } else {
                    passPercent = _test.passPercent;
                    timeTest = _test.timeTest;
                    studyId = _test.slug + "";
                    // co du lieu roi thi gan du lieu de load game
                    let questionsData = mapTopicQuestions[studyId];
                    if (!questionsData || questionsData.length == 0) {
                        // chua co questions data thi goi api thoi
                        getTest = true;
                    }
                }
            } else {
                let accessTopic = topics.find(
                    (t) => t.slug.includes(slug)
                    //  && appInfo.appId + "" == t.rootTopicId + ""
                );
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
                        let maxLevel = getHighhestLevelOfTopicBePracticed(lisGameStates, accessTopic);
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
                let _gameState = lisGameStates.find((game) => {
                    return game.id == studyId;
                });
                let timeTestReducer = state.timeLeftReducer.data;
                let _timeTest = timeTestReducer[studyId]?.timeTest ?? 0;
                if (_gameState) {
                    let gameState = GameState.cloneGameState(_gameState);
                    // có rồi thì restore lại thôi
                    gameState.levelTag = level_tag; // gán lại chỗ này cho quá trình dev thôi
                    if (gameType == Config.TOPIC_GAME) {
                        // vì chỗ này đặt return nên phải thêm 1 dòng này ở đây
                        window.location.href = "/" + fullSlug + "#" + level_tag;
                        // history.replaceState(null, "", "/" + fullSlug + "#" + level_tag);
                    }
                    gameState.timeTest = _timeTest;
                    if (gameState.arrayIndexWrong.length) {
                        // cần xử lý đoạn này để tránh trường hợp bug đã làm đúng rồi nhưng vì lý do nào đó mà không update lại arrayIndexWrong
                        gameState.arrayIndexWrong = [];
                        for (let i = 0; i < gameState.questions.length; i++) {
                            let isWrongAnswer = false;
                            for (let c of gameState.questions[i].choices) {
                                if (c.isCorrect && !c.selected) isWrongAnswer = true;
                            }
                            if (isWrongAnswer) gameState.arrayIndexWrong.push(i);
                        }
                    }
                    console.log("Restore game!");
                    if (gameType !== Config.TOPIC_GAME)
                        dispatch(setTimeTest({ id: gameState.id, timeTest: gameState.timeTest }));
                    return gameState;
                }
            }

            // lấy dữ liệu mới ------------------------------------------------------------------------------
            let questionsData = [];
            if (getTest) {
                // vi api tra ve ca data cua test va question luon nen dung chung 1 bien getTest de check
                let testTag = slug
                    .replace("full-length-" + (_state ? _state + "-" : "") + appInfo.appShortName, "")
                    .replace("-practice-test", "");

                let data = await getTestDataFromGoogleStorage(
                    appInfo.bucket,
                    gameType == Config.BRANCH_TEST_GAME ? slug : "full-tests" + (testTag ? testTag : ""),
                    _state
                );

                let test = data[0].test;
                test.slug = "/" + fullSlug;
                studyId = test.slug;
                passPercent = test.passPercent;
                timeTest = test.timeTest;
                test.stateTag = _state;
                questionsData = data[0].cards;
                if (questionsData.length) {
                    // update vao redux; cho nay can chu y check truong hop co data nhung khong du so luong!!
                    dispatch(getQuestionsDataSuccess({ parentId: studyId, questions: questionsData }));
                } else
                    throw {
                        err: "Test question reponse by api is empty!",
                    };
                dispatch(getTestSuccess([test]));
            }
            if (getTopic) {
                // mặc định coi vào trường hợp này là tải dữ liệu mới về => vào level thấp nhất
                let data: any = await readFileAppFromGoogleStorage(appInfo, _state); // get data ve
                topics = data?.topics ?? [];
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
            if (level_tag && gameType == Config.TOPIC_GAME) {
                window.location.href = "/" + fullSlug + "#" + level_tag;
                // history.replaceState(null, "", "/" + fullSlug + "#" + level_tag);
            }
            if (getTopicQuestions) {
                //chua co topic questions data
                questionsData = await getTopicQuestionsFromGoogleStorage(
                    appInfo.bucket,
                    topic_tag + (level_tag ? "-" + level_tag : ""),
                    _state
                );

                if (questionsData?.length) {
                    // update vao redux
                    dispatch(getQuestionsDataSuccess({ parentId: studyId, questions: questionsData }));
                } else
                    throw {
                        err: "Topic question reponse by api is empty!",
                    };
            }

            //get xong data rồi thì load game mới hoàn toàn
            try {
                const mapQuestionsData: { [key: string]: Question[] } = state.cardReducer.mapTopicQuestions;
                const appId: number = state.appInfoReducer.appInfo.appId;
                let questions = questionsData.length // lấy luôn data được tải về hoặc lấy trong reducer (trường hợp đã có sẵn data rồi)
                    ? questionsData.map((q) => new Question(q))
                    : [...mapQuestionsData[studyId]];
                //shuffleV4 let questions = (_questions); // không shuffle câu hỏi vì đang được sort theo trình tự dễ -> khó

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
                gameState.gameType = gameType;
                gameState.questions = questions.map((q, index) => {
                    //suffle các đáp án
                    q.choices = shuffleV4(q.choices);
                    return new Question({
                        ...q,
                        index: index,
                    });
                });
                gameState.currentQuestion = gameState.questions[0];
                gameState.showAnswer = gameType == Config.TOPIC_GAME;
                gameState.gameTitle = gameTitle ?? "";
                gameState.passPercent = passPercent;
                gameState.appId = appId;
                gameState.defaultTimeTest = timeTest; // lưu lại giá trị này để restart, trường hợp restore và restart thì vào case khác
                gameState.timeTest = timeTest;
                gameState.levelTag = level_tag;

                console.log("Start new game!");

                dispatch(updateToListGames(gameState));
                if (gameState.gameType !== Config.TOPIC_GAME)
                    dispatch(setTimeTest({ id: gameState.id, timeTest: gameState.timeTest }));
                if (resetData()) {
                    localStorage.setItem("data-version", DATA_VERSION);
                }
                return gameState;
            } catch (err) {
                console.log("loadStudyGame Error: ", err);
            }
        }
    } catch (e) {
        console.log(e);
    }
    return GameState.init();
});

const goToQuestion = createAsyncThunk("game/goToQuestion", async (index: number, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as AppState;
    let gameState = GameState.cloneGameState(state.gameReducer.game);
    try {
        let thisQuestion = gameState.questions[index ?? 0];
        gameState.currentQuestion = thisQuestion;
        gameState.indexActive = index ?? 0;
        // khi chon sang mot cau hoi khac thi can khoi phuc trang thai hien co cua cau hoi do
        gameState.listSelected = thisQuestion.choices.filter((c) => c.selected);
        dispatch(updateToListGames(gameState));
    } catch (e) {
        console.log(e);
    }
    return gameState;
});

const onChooseAnswer = createAsyncThunk(
    "game/onChooseAnswer",
    async (payload: IChoice, { dispatch, getState, rejectWithValue }) => {
        const state = getState() as AppState;
        let choice = payload;
        let gameState = GameState.cloneGameState(state.gameReducer.game);
        try {
            let _cQuestion = new Question(gameState.currentQuestion);
            let correctNum = _cQuestion.getCorrectNum(); // số đáp án đúng của câu hỏi

            if (gameState.gameType !== Config.TOPIC_GAME) {
                // test được chọn lại đáp án (theo kiểu queue),
                // bấm chọn lại đáp án đã chọn rồi thì tức là bỏ nó đi
                let isExisted = false;
                gameState.listSelected = gameState.listSelected
                    .map((item) => {
                        if (item.id == choice.id) {
                            isExisted = true;
                            return null; // bỏ đáp án khi chọn lại lần thứ 2
                        }
                        return item;
                    })
                    .filter((item) => !!item);
                if (!isExisted) {
                    // nếu là lần chọn mới thì push vào (check trường hợp chọn quá số lượng)
                    if (gameState.listSelected.length == correctNum) {
                        gameState.listSelected.push(choice); // thêm vào cuối
                        gameState.listSelected.shift(); // xoá ở đầu;
                    } else if (gameState.listSelected.length < correctNum) {
                        gameState.listSelected.push(choice);
                    } else {
                        // trường hợp chọn quá (theo logic xử lý thì không xảy ra, nhưng vẫn check cho an toàn)
                        gameState.listSelected.push(choice);
                        gameState.listSelected = gameState.listSelected.slice(
                            gameState.listSelected.length - correctNum,
                            gameState.listSelected.length
                        );
                    }
                }
            } else {
                // topic thì đã check ngoài giao diện là nếu hiện kết quả rồi thì không được chọn nữa
                gameState.listSelected.push(choice); //them lua chon vao ds tra loi cho cau hoi hien tai
            }

            let answeredQuestionIds = gameState.answeredQuestionIds;
            if (!answeredQuestionIds.find((id) => id == _cQuestion.id)) {
                ga.event({
                    action: "question/user",
                    params: {
                        questionId: _cQuestion.id,
                    },
                });
                ga.event({
                    action:
                        gameState.gameType !== Config.TOPIC_GAME ? "full_test_questions_per_user" : "topic_questions_per_user",
                    params: {
                        questionId: _cQuestion.id,
                    },
                });
                answeredQuestionIds.push(_cQuestion.id);
                gameState.answeredQuestionIds = answeredQuestionIds;
            }
            for (let c of _cQuestion.choices) {
                // danh dau cac dap an duoc chon
                if (gameState.listSelected.find((_c) => _c.id == c.id)) {
                    c.selected = true;
                } else c.selected = false;
            }

            if (correctNum == gameState.listSelected.length) {
                let numberOfCorrectAnswers = gameState.listSelected.filter((c) => c.isCorrect).length;
                if (numberOfCorrectAnswers == correctNum) {
                    // tra loi dung
                    _cQuestion.questionStatus = Config.QUESTION_ANSWERED_CORRECT;
                } else {
                    // tra loi sai
                    _cQuestion.questionStatus = Config.QUESTION_ANSWERED_INCORRECT;
                }
            } else if (gameState.listSelected.length > 0) {
                //co chon dap an nhung chua het
                _cQuestion.questionStatus = Config.QUESTION_SELECTED;
            }
            if (gameState.levelTag.includes("level")) {
                // lưu lại progress cho phần level để ở phần end hiện ở thanh progress
                if ([Config.QUESTION_ANSWERED_CORRECT, Config.QUESTION_ANSWERED_INCORRECT].includes(_cQuestion.questionStatus))
                    _cQuestion.progress.push(_cQuestion.questionStatus == Config.QUESTION_ANSWERED_CORRECT ? 1 : 0);
                if (_cQuestion.progress.length > 3)
                    _cQuestion.progress.slice(_cQuestion.progress.length - 3, _cQuestion.progress.length);
            }
            gameState.questions = gameState.questions.map((q) => {
                // update vào list questions
                // chú ý là update vào mapTopicQuestions nữa (viết hàm saga) - cái này chưa có
                if (q.id == _cQuestion.id) return _cQuestion;
                return q;
            });
            gameState.currentQuestion = _cQuestion;

            // xử lý riêng phần học topic level (bê nguyên từ reducer sang nên tạm đặt biến _state), tránh bug mất mát dữ liệu giữa gameState và listGameState
            let _state = gameState;
            if (_state.levelTag.includes("level")) {
                // phần học topic [level]
                let indexActive = _state.indexActive;
                if (indexActive == _state.questions.length - 1 && _state.arrayIndexWrong.length == 0) {
                    // lượt làm đầu tiên (arrayIndexWrong == []) và cần đảm bảo arrayIndexWrong == []
                    // nếu làm đến câu cuối thì kiểm tra xem còn câu sai phía trước không để add vào arrayIndexWrong để thực hiện làm lại (theo luồng học cũ làm đến khi nào đúng hết thì thôi)
                    let _arrayIndexWrong: number[] = [];
                    for (let i = 0; i < _state.questions.length; i++) {
                        if (_state.questions[i].questionStatus == Config.QUESTION_ANSWERED_INCORRECT) _arrayIndexWrong.push(i);
                    }

                    _state.arrayIndexWrong = _arrayIndexWrong;
                } else if (_state.arrayIndexWrong.length > 0) {
                    //không phải lượt làm đầu tiên
                    if (_state.currentQuestion.questionStatus == Config.QUESTION_ANSWERED_INCORRECT) {
                        // nếu trả lời sai
                        if (_state.arrayIndexWrong.includes(indexActive)) {
                            // câu hiện tại đang nằm trong ds các câu đang trả lời sai
                            if (_state.arrayIndexWrong.length == 1) {
                                // // còn sai đúng 1 câu và vẫn tiếp tục trả lời sai / cái này xử lý trong NEXT_QUESTION rồi
                            } else {
                                // còn nhiều câu sai, và câu hiện tại sẽ là câu đầu tiên trong arrayIndexWrong (logic hiện tại là thế và cần đảm bảo như vậy để tránh bug phát sinh)
                                _state.arrayIndexWrong = _state.arrayIndexWrong.filter((i) => i != indexActive);
                                _state.arrayIndexWrong.push(indexActive); // thêm vào cuối ds như hàng đợi
                            }
                        } else {
                            // nếu đây là một câu sai mới thì push vào arrayIndexWrong
                            _state.arrayIndexWrong.push(indexActive);
                        }
                    } else {
                        // trả lời đúng (và câu này sẽ nằm trong arrayIndexWrong - cần đảm bảo nó nằm trong arrayIndexWrong vì rơi vào trường hợp này là đang ở đoạn trả lời lại các câu đã sai)
                        _state.arrayIndexWrong = _state.arrayIndexWrong.filter((i) => i != indexActive);
                    }
                }
            }
            dispatch(updateToListGames(gameState));
        } catch (e) {
            console.log(e);
        }
        return gameState;
    }
);

const nextQuestion = createAsyncThunk("game/nextQuestion", async (_, { dispatch, getState, rejectWithValue }) => {
    // let gameState = GameState.cloneGameState(payload);
    const state = getState() as AppState;
    let gameState = GameState.cloneGameState(state.gameReducer.game);
    try {
        let indexActive = gameState.indexActive + 1; // mặc định là next sang câu kế tiếp
        if (gameState.levelTag.includes("level")) {
            // chỉ xử lý cho phần topic [level] thôi nha
            if (gameState.arrayIndexWrong.length > 0) {
                // đi vào nhánh này là đã trả lời hết lượt đầu rồi, còn câu nào sai (nằm trong arrayIndexWrong - được update trong ON_CHOOSE_ANSWER_SUCCESS) thì lấy ra làm nốt
                if (gameState.arrayIndexWrong.length == 1 && gameState.arrayIndexWrong[0] == gameState.indexActive) {
                    // câu vừa làm xong đã nằm trong arrayIndexWrong và vẫn tiếp tục sai thì gán indexActive là 1 câu bất kỳ khác
                    indexActive = Math.floor(Math.random() * gameState.questions.length);
                    if (indexActive == gameState.indexActive) indexActive--;
                    if (indexActive < 0) indexActive = gameState.questions.length - 1;
                } else indexActive = gameState.arrayIndexWrong[0]; // lấy ra index đầu tiên trong arrayIndexWrong để làm lại
                gameState.questions[indexActive].choices = shuffleV4(gameState.questions[indexActive].choices); // đảo lại vị trí các đáp án của câu bị làm lại
            }
        }
        // reset lại câu hỏi đó (vì trường hợp topic [level] là làm đến khi nào đúng hết thì thôi nên sẽ next qua các câu đã từng làm)
        // chú ý là dạng test có thể chọn lại câu trước đó để làm lại thì next sang câu kế tiếp phải giữ nguyên hiện trạng
        let forceReset = false;
        if (
            !(
                gameState.gameType !== Config.TOPIC_GAME &&
                gameState.answeredQuestionIds.includes(gameState.questions[indexActive].id)
            )
        ) {
            forceReset = true;
        }
        gameState.indexActive = indexActive;
        if (forceReset) gameState.questions[indexActive].questionStatus = Config.QUESTION_NOT_ANSWERED;
        gameState.currentQuestion = gameState.questions[indexActive];
        if (forceReset) {
            for (let c of gameState.currentQuestion.choices) {
                c.selected = false;
            }
            gameState.listSelected = [];
        }
        dispatch(updateToListGames(gameState));
    } catch (e) {
        console.log(e);
    }
    return gameState;
});

const onGameSubmitted = createAsyncThunk("game/onGameSubmitted", async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;
    ga.event({
        action: "see_end_test",
        params: { from: window.location.href },
    });
    let gameState = GameState.cloneGameState(state.gameReducer.game);
    try {
        const questions = gameState.questions;
        const totalQuestions = questions.length;
        let mistake = 0,
            skipped = 0,
            correct = 0;

        questions.forEach((question) => {
            switch (question.questionStatus) {
                case Config.QUESTION_ANSWERED_CORRECT:
                    correct++;
                    break;
                case Config.QUESTION_ANSWERED_SKIP:
                    skipped++;
                default:
                    // mistake tính cả question skip và question k answer
                    mistake++;
            }
        });
        gameState.progress = new Progress({
            mistake,
            skipped,
            correct,
            total: totalQuestions,
        });
        gameState.isFinishGame = 1;
        if (totalQuestions > 0) {
            if (gameState.progress.correct < (totalQuestions * gameState.passPercent) / 100) {
                gameState.status = Config.GAME_STATUS_FAILED;
                ga.event({
                    action: "fail_test",
                    params: { from: window.location.href },
                });
            } else {
                gameState.status = Config.GAME_STATUS_PASSED;
                ga.event({
                    action: "pass_test",
                    params: { from: window.location.href },
                });
            }
        }
        dispatch(updateToListGames(gameState));
    } catch (e) {
        console.log(e);
    }
    return gameState;
});

const onRestartGame = createAsyncThunk("game/onRestartGame", async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as AppState;
    let gameState = GameState.cloneGameState(state.gameReducer.game);
    // console.log(gameState);

    gameState.questions = gameState.questions.map((question) => {
        question.choices = question.choices.map((choice) => ({
            ...choice,
            selected: false,
        }));
        question.questionStatus = Config.QUESTION_NOT_ANSWERED;
        question.choices = shuffleV4(question.choices);
        return question;
    });
    gameState.currentQuestion = gameState.questions[0];
    gameState.indexActive = 0;
    gameState.listSelected = [];
    gameState.arrayIndexWrong = [];
    gameState.isFinishGame = 0;
    gameState.answeredQuestionIds = [];
    gameState.progress = new Progress({});
    gameState.timeTest = gameState.defaultTimeTest; // lấy lại giá trị mặc định ban đầu, trường defaultTimeTest cần đảm bảo chỉ được gán khi khởi tạo game mới
    if (gameState.levelTag.includes("level")) {
        // hiện tại áp dụng cho phần level thôi nha
        for (let q of gameState.questions) {
            // reset lại progress của từng câu hỏi khi làm lại
            q.progress = [];
        }
    }
    dispatch(setTimeTest({ id: gameState.id, timeTest: gameState.timeTest }));
    dispatch(updateToListGames(gameState));
    return gameState;
});

export { getStudyData, goToQuestion, onChooseAnswer, nextQuestion, onGameSubmitted, onRestartGame };
