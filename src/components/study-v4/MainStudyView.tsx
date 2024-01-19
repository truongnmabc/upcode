import "./MainStudyView.scss";
import { GameState, getNumOfCorrectAnswer } from "../../redux/features/game";
import { IAppInfo } from "../../models/AppInfo";
import { IChoice } from "../../models/Choice";
// import { nextQuestion, onChooseAnswer, onGameSubmitted } from "../../redux/actions/game.action";
import { TextContentType } from "../../utils/v4_question";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import * as ga from "../../lib/ga";
import ChoicesPanelV4 from "./ChoicesPanelV4";
import Config from "../../config";
import dynamic from "next/dynamic";
import QuestionMultipleChoiceV4 from "./QuestionMultipleChoiceV4";
import useMediaQuery from "@mui/material/useMediaQuery";
import V4QuestionContent from "./V4QuestionContent";
const CancelRoundedIcon = dynamic(() => import("@mui/icons-material/CancelRounded"));
const CheckCircleRoundedIcon = dynamic(() => import("@mui/icons-material/CheckCircleRounded"));
const CountDownV4 = dynamic(() => import("./CountDownV4"));
const ErrorRoundedIcon = dynamic(() => import("@mui/icons-material/ErrorRounded"));
const InfoIcon = dynamic(() => import("../icon/InfoIcon"));
const V4CircleProgress = dynamic(() => import("../v4-material/V4CircleProgress"));
const MainStudyView = ({ gameState, appInfo }: { gameState: GameState; appInfo: IAppInfo }) => {
    let currentQuestion = gameState.currentQuestion;
    const isDesktop = useMediaQuery("(min-width:769px)");
    // const dispatch = useDispatch();
    let thisQuestionIsDone =
        currentQuestion.questionStatus == Config.QUESTION_ANSWERED_CORRECT ||
        currentQuestion.questionStatus == Config.QUESTION_ANSWERED_INCORRECT;
    // RIÊNG PHẦN LEVEL: luồng học cũ: làm đến khi nào đúng hết thì thôi, làm đến câu cuối theo thứ tự mà vẫn còn câu sai phía trước thì nhảy về làm, trường hợp đặc biệt là chỉ còn duy nhất 1 câu mà vẫn sai thì nhảy sang câu khác (không làm lại câu sai đó nữa)
    let numOfCorrectAnswer = getNumOfCorrectAnswer(gameState.questions);
    let isLastQuestion = gameState.levelTag.includes("level")
        ? numOfCorrectAnswer === gameState.questions.length
        : gameState.indexActive === gameState.questions.length - 1;

    const collapseParagraph = (forceHide = false) => {
        let collapse = document.getElementById("my-collapse");
        if (!collapse) return; // trường hợp không có paragraph thì hàm này không có tác dụng
        let btn = document.getElementById("btn-open-collapse");
        let pgWrapper = document.getElementById("pg-content-wrapper");
        if (collapse.className.includes("show") || forceHide) {
            collapse.className = "";
            btn.innerHTML = "Read more";
            collapse.style.height = "0";
        } else {
            collapse.className = "show";
            btn.innerHTML = "Show less";
            collapse.style.height = pgWrapper.clientHeight + "px";
        }
    };
    const onChoiceSelected = (choice: IChoice) => {
        // ga.event({
        //     action: "v4_study_users_answer_quiz",
        //     params: {
        //         action_type: "click",
        //         target_question_id: choice.questionId,
        //         target_is_correct: choice.isCorrect,
        //         context_page: gameState.gameType == Config.TEST_GAME ? "test" : "topic",
        //         context_study_id: gameState.id,
        //     },
        // });
        // dispatch(onChooseAnswer(choice));
    };

    return (
        <div className="v4-main-study-view-0">
            <div className="v4-main-study-view-1 v4-border-radius">
                {!gameState.isLoadedStudyData ? (
                    <V4CircleProgress />
                ) : (
                    <>
                        {gameState.gameType == Config.TEST_GAME && isDesktop && (
                            <div className="v4-test-game-count-down-desktop-0 v4-flex">
                                <CountDownV4 gameState={gameState} />
                            </div>
                        )}
                        {/* hiện tại chỗ này không dùng được GamePanelV4 vì phần này có nhiều config riêng quá */}
                        <div className="v4-main-study-view-question-content-0 v4-border-radius">
                            <V4QuestionContent
                                content={currentQuestion.question}
                                bucket={appInfo.bucket}
                                renderMathJax={true}
                                image={currentQuestion.image}
                            />
                            <div className="v4-question-paragraph" style={{ cursor: "pointer" }}>
                                <div
                                    className={!!currentQuestion.paragraphContent?.length ? "show-btn" : ""}
                                    id="btn-open-collapse"
                                    onClick={() => {
                                        if (currentQuestion.paragraphContent?.length) collapseParagraph();
                                    }}
                                >
                                    Read more
                                </div>
                                <div
                                    style={{
                                        color: "#555",
                                    }}
                                >
                                    <div id="my-collapse">
                                        <div id="pg-content-wrapper">
                                            <V4QuestionContent
                                                content={currentQuestion.paragraphContent ?? ""}
                                                type={TextContentType.explanation}
                                                bucket={appInfo.bucket}
                                                renderMathJax={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {gameState?.levelTag?.includes("level") && (
                                // (**#**)
                                <>
                                    <div
                                        className={`v4-see-this-question-soon ${
                                            gameState.currentQuestion.questionStatus != Config.QUESTION_NOT_ANSWERED
                                                ? "show"
                                                : "" // cần animation nên viết như này
                                        }`}
                                    >
                                        {!gameState.answeredQuestionIds.includes(gameState.currentQuestion.id)}
                                        {gameState.currentQuestion.questionStatus == Config.QUESTION_ANSWERED_INCORRECT && (
                                            <>
                                                <CancelRoundedIcon htmlColor="#fb7072" />
                                                <span style={{ color: "#fb7072" }}>
                                                    <div>INCORRECT</div>
                                                    <span>You will see this question soon</span>
                                                </span>
                                            </>
                                        )}
                                        {gameState.currentQuestion.questionStatus == Config.QUESTION_ANSWERED_CORRECT && (
                                            <>
                                                <CheckCircleRoundedIcon htmlColor="#00c17c" />
                                                <span style={{ color: "#00c17c" }}>
                                                    <div>CORRECT</div>
                                                    <span>You will not see this question for a while</span>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {gameState.currentQuestion.questionStatus == Config.QUESTION_NOT_ANSWERED &&
                                        (gameState.answeredQuestionIds.includes(gameState.currentQuestion.id) ? (
                                            gameState.arrayIndexWrong.includes(gameState.indexActive) ? (
                                                <div className="v4-got-this-question-wrong-last-time-or-new-question">
                                                    <ErrorRoundedIcon htmlColor="#E3A651" />
                                                    <span style={{ color: "#E3A651" }}>
                                                        <div>LEARNING</div>
                                                        <span>You got this question wrong last time</span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="v4-got-this-question-wrong-last-time-or-new-question">
                                                    <CheckCircleRoundedIcon htmlColor="#00c17c" />
                                                    <span style={{ color: "#00c17c" }}>
                                                        <div>REVIEWING</div>
                                                        <span>You got this question last time</span>
                                                    </span>
                                                </div>
                                            )
                                        ) : (
                                            <div className="v4-got-this-question-wrong-last-time-or-new-question">
                                                <InfoIcon color="#6BA6FF" />
                                                <span style={{ color: "#6BA6FF" }}>
                                                    <div>NEW QUESTION</div>
                                                </span>
                                            </div>
                                        ))}
                                </>
                            )}
                        </div>

                        <QuestionMultipleChoiceV4 currentQuestion={currentQuestion} />
                        <ChoicesPanelV4
                            bucket={appInfo.bucket}
                            currentQuestion={gameState.currentQuestion}
                            allowShowAnswer={gameState.showAnswer}
                            onChoiceSelected={onChoiceSelected}
                        />

                        <div
                            className={
                                "v4-explanation-detail" +
                                (thisQuestionIsDone && gameState.gameType == Config.STUDY_GAME ? " show " : "")
                            }
                        >
                            <div className={"v4-explanation-detail-title"}>Detailed Explanation</div>
                            <div className={"v4-explanation"}>
                                <div className="explanation-content-wrapper">
                                    <div>
                                        <V4QuestionContent
                                            content={
                                                thisQuestionIsDone && gameState.gameType == Config.STUDY_GAME
                                                    ? currentQuestion.explanation
                                                    : ""
                                            }
                                            type={TextContentType.explanation}
                                            bucket={appInfo.bucket}
                                            renderMathJax={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="v4-main-study-view-btn-wrapper" id="v4-sticky" style={{ textAlign: "right" }}>
                            <div id="v4-btn-sticky" className={thisQuestionIsDone ? " show " : ""}>
                                <button
                                    className={
                                        "v4-main-study-view-btn-0 v4-border-radius" + (thisQuestionIsDone ? " show " : "")
                                    }
                                    onClick={(e) => {
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                        if (isLastQuestion) {
                                            // dispatch(onGameSubmitted());
                                            // chọn đáp án là xử lý xong hết rồi đến đây chỉ việc chuyển sang trang kết quả thôi
                                        } else {
                                            collapseParagraph(true);
                                            // dispatch(nextQuestion(gameState));
                                        }
                                    }}
                                >
                                    {isLastQuestion ? "Finish" : "Next Question"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MainStudyView;
