import "./MainStudyView.scss";
import { GameState, getNumOfCorrectAnswer } from "../../redux/features/game";
import { IAppInfo } from "../../models/AppInfo";
import { IChoice } from "../../models/Choice";
import { TextContentType, renderMath } from "../../utils/v4_question";
import { useDispatch } from "react-redux";
import * as ga from "../../services/ga";
import ChoicesPanelV4 from "./ChoicesPanelV4";
import Config from "../../config";
import dynamic from "next/dynamic";
import QuestionMultipleChoiceV4 from "./QuestionMultipleChoiceV4";
import V4QuestionContent from "./V4QuestionContent";
import { nextQuestion, onChooseAnswer, onGameSubmitted } from "@/redux/reporsitory/game.repository";
import { useEffect } from "react";

const CancelRoundedIcon = dynamic(() => import("@mui/icons-material/CancelRounded"), { ssr: false });
const CheckCircleRoundedIcon = dynamic(() => import("@mui/icons-material/CheckCircleRounded"), { ssr: false });
const CountDownV4 = dynamic(() => import("./CountDownV4"), { ssr: false, loading: () => <div style={{ height: 29 }} /> });
const ErrorRoundedIcon = dynamic(() => import("@mui/icons-material/ErrorRounded"), { ssr: false });
const InfoIcon = dynamic(() => import("../icon/InfoIcon"), { ssr: false });
const V4CircleProgress = dynamic(() => import("../v4-material/V4CircleProgress"));

const MainStudyView = ({ gameState, appInfo }: { gameState: GameState; appInfo: IAppInfo }) => {
    let currentQuestion = gameState.currentQuestion;
    // const isDesktop = useMediaQuery("(min-width:769px)");
    const dispatch = useDispatch();
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
        ga.event({
            action: "v4_study_users_answer_quiz",
            params: {
                action_type: "click",
                target_question_id: choice.questionId,
                target_is_correct: choice.isCorrect,
                context_page: gameState.gameType == Config.TOPIC_GAME ? "topic" : "test",
                context_study_id: gameState.id,
            },
        });
        dispatch(onChooseAnswer(choice));
    };

    useEffect(() => {
        if (window.MathJax) {
            renderMath(); // vì nội dung mathjax tải lâu hơn nên phải truyền hàm này vào
        } else {
            setTimeout(() => {
                renderMath();
            }, 1500);
        }
    }, [JSON.stringify(gameState)]);

    const submitGame = () => {
        dispatch(onGameSubmitted());
    };

    const _nextQuestion = () => {
        collapseParagraph(true);
        dispatch(nextQuestion());
    };

    useEffect(() => {
        const handleEnterEvent = (event: KeyboardEvent) => {
            // if (Config.KEYBOARD.includes(event.code)) {
            //     localStorage.setItem("useKeyboard", "true");
            // }
            if (event.code == "Space") {
                if (isLastQuestion) {
                    submitGame();
                    return;
                }

                _nextQuestion();
            }
        };
        document.removeEventListener("keydown", handleEnterEvent, true);
        if (thisQuestionIsDone) {
            if (!gameState.isFinishGame) {
                document.addEventListener("keydown", handleEnterEvent, true);
            }
        }

        return () => {
            document.removeEventListener("keydown", handleEnterEvent, true);
        };
    }, [thisQuestionIsDone, isLastQuestion]);

    return (
        <div className="v4-main-study-view-0">
            <div className="v4-main-study-view-1 v4-border-radius">
                {!gameState.isLoadedStudyData ? (
                    <V4CircleProgress />
                ) : (
                    <>
                        {gameState.gameType !== Config.TOPIC_GAME && (
                            <div className="v4-test-game-count-down-desktop-0 _769">
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
                                <div style={{ height: "36px" }}>
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
                                                <div style={{ width: 24, height: 24 }}>
                                                    <CancelRoundedIcon htmlColor="#fb7072" />
                                                </div>
                                                <span style={{ color: "#fb7072" }}>
                                                    <div>INCORRECT</div>
                                                    <span>You will see this question soon</span>
                                                </span>
                                            </>
                                        )}
                                        {gameState.currentQuestion.questionStatus == Config.QUESTION_ANSWERED_CORRECT && (
                                            <>
                                                <div style={{ width: 24, height: 24 }}>
                                                    <CheckCircleRoundedIcon htmlColor="#00c17c" />
                                                </div>
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
                                                    <div style={{ width: 24, height: 24 }}>
                                                        <ErrorRoundedIcon htmlColor="#E3A651" />
                                                    </div>
                                                    <span style={{ color: "#E3A651" }}>
                                                        <div>LEARNING</div>
                                                        <span>You got this question wrong last time</span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="v4-got-this-question-wrong-last-time-or-new-question">
                                                    <div style={{ width: 24, height: 24 }}>
                                                        <CheckCircleRoundedIcon htmlColor="#00c17c" />
                                                    </div>
                                                    <span style={{ color: "#00c17c" }}>
                                                        <div>REVIEWING</div>
                                                        <span>You got this question last time</span>
                                                    </span>
                                                </div>
                                            )
                                        ) : (
                                            <div className="v4-got-this-question-wrong-last-time-or-new-question">
                                                <div style={{ width: 24, height: 24 }}>
                                                    <InfoIcon color="#6BA6FF" />
                                                </div>
                                                <span style={{ color: "#6BA6FF" }}>
                                                    <div>NEW QUESTION</div>
                                                </span>
                                            </div>
                                        ))}
                                </div>
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
                                (thisQuestionIsDone && gameState.gameType == Config.TOPIC_GAME ? " show " : "")
                            }
                        >
                            <div className={"v4-explanation-detail-title"}>Detailed Explanation</div>
                            <div className={"v4-explanation"}>
                                <div className="explanation-content-wrapper">
                                    <div>
                                        <V4QuestionContent
                                            content={
                                                thisQuestionIsDone && gameState.gameType == Config.TOPIC_GAME
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
                                            submitGame();
                                            // chọn đáp án là xử lý xong hết rồi đến đây chỉ việc chuyển sang trang kết quả thôi
                                        } else {
                                            _nextQuestion();
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
