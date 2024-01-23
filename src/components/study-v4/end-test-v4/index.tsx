import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { IAppInfo } from "../../../models/AppInfo";
import DownloadAppEndTest from "./DownloadAppEndTest";
import ReviewAnswer from "./ReviewAnswer";
// import * as ga from "../../../lib/ga";
import { getGameProgress, getHighhestLevelOfTopicBePassedSequentially } from "../../../utils/v4_study";
import { ITopic } from "../../../models/Topic";
import { APP_SHORT_NAME } from "../../../config_app";
import { SYNC_TYPE } from "../../../config/config_sync";
import "./index.scss";
import TargetIcon from "../../icon/TargetIcon";
import AppState from "@/redux/appState";
import { GameState } from "@/redux/features/game";
import { getStudyData, onRestartGame } from "@/redux/reporsitory/game.repository";

const getDoneTestText = (isPass?: boolean, endLevelView?: string) => {
    const TITLE_PASSED = "Such an excellent performance";
    const DESCRIPTION_PASSED =
        "Good job! You've successfully passed your test. Let's ace all the tests available to increase your passing possibility!";
    const TITLE_FAILED = "Not enough to pass";
    const DESCRIPTION_FAILED =
        "Yowch! That hurt. Failing an exam always does. But hey, that was just one try. Get your notes together and try again. You can do it!";
    const TITLE_LEVEL = "You made it!";
    const DESCRIPTION_LEVEL = (
        <>
            <span>You</span>
            <span>correctly</span>
            <span>answered</span>
            <b className="v4-font-semi-bold">{endLevelView}</b>
            <span>questions</span>
            <span>on</span>
            <span>the</span>
            <span>first</span>
            <span>turn</span>
        </>
    );
    const result = {
        title: endLevelView ? TITLE_LEVEL : isPass ? TITLE_PASSED : TITLE_FAILED,
        description: endLevelView ? DESCRIPTION_LEVEL : isPass ? DESCRIPTION_PASSED : DESCRIPTION_FAILED,
    };
    return result;
};

const EndTestV4 = ({
    gameState,
    appInfo,
    currentTopic,
}: {
    gameState: GameState;
    appInfo: IAppInfo;
    currentTopic?: ITopic;
}) => {
    const isDesktop = useMediaQuery("(min-width:769px)");
    const { isPass, passPercent, currentScore, correctNum } = getGameProgress(gameState);

    let nextLevelHref = ""; // cái này để dùng cho phần end của level topic
    let finalTestHref = ""; // cái này để dùng cho phần end của level topic
    let listGameState: GameState[] = useSelector((state: AppState) => state.listGameReducer.games);
    if (currentTopic) {
        let currentLevelIndex = currentTopic.topics.findIndex((lv) => lv.id == gameState.id);
        let nextLevelIndex = currentLevelIndex;
        let highestLevel = getHighhestLevelOfTopicBePassedSequentially(listGameState, currentTopic);
        if (currentLevelIndex < currentTopic.topics.length - 1) nextLevelIndex = currentLevelIndex + 1;
        if (nextLevelIndex > highestLevel) nextLevelIndex = highestLevel; // trường hợp nhảy cóc sang mini test thì next level sẽ là level tiếp theo theo tuần tự
        if (nextLevelIndex < currentTopic.topics.length - 1) {
            //tại các level trước final test thì mới có nút next level và final test
            if (isPass)
                nextLevelHref = `/${APP_SHORT_NAME}-${currentTopic.tag}-practice-test#${currentTopic.topics[nextLevelIndex].tag}`;
            finalTestHref = `/${APP_SHORT_NAME}-${currentTopic.tag}-practice-test#final-test`;
        }
    }
    let isEndLevel = gameState.levelTag.includes("level");
    const { title, description } = getDoneTestText(isPass, isEndLevel ? `${correctNum}/${gameState.progress.total}` : "");
    return (
        <>
            <div className="v4-end-test v4-border-radius">
                <div className="v4-end-test-container">
                    <div className="v4-end-test-container-title">
                        {!isDesktop && (
                            <div
                                className="v4-end-test-container-title-icon"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                            >
                                <ArrowBackIosNewRoundedIcon htmlColor="#212121" />
                            </div>
                        )}
                        {title}
                    </div>
                    <div className="v4-end-test-container-description">{description}</div>
                    <div className="v4-end-test-container-progress">
                        <ProgressBar score={currentScore} target={passPercent} isEndLevel={isEndLevel} />
                    </div>

                    <DownloadAppEndTest appInfo={appInfo} isDesktop={isDesktop} gameState={gameState} />
                    {isDesktop && (
                        <EndTestButton
                            levelTag={gameState.levelTag}
                            nextLevelHref={nextLevelHref}
                            finalTestHref={finalTestHref}
                            topicId={currentTopic?.id ?? ""}
                        />
                    )}
                </div>

                {isDesktop && !gameState.levelTag.includes("level") && (
                    <div id="study_review">
                        <ReviewAnswer gameState={gameState} appInfo={appInfo} />
                    </div>
                )}
            </div>
            {!isDesktop && !gameState.levelTag.includes("level") && (
                <>
                    <EndTestButton
                        levelTag={gameState.levelTag}
                        nextLevelHref={nextLevelHref}
                        finalTestHref={finalTestHref}
                        topicId={currentTopic?.id ?? ""}
                    />
                    <div id="study_review">
                        <ReviewAnswer gameState={gameState} appInfo={appInfo} />
                    </div>
                </>
            )}
        </>
    );
};

const EndTestButton = ({
    levelTag,
    nextLevelHref,
    finalTestHref,
    topicId,
}: {
    levelTag: string;
    nextLevelHref: string;
    finalTestHref: string;
    topicId: string;
}) => {
    const dispatch = useDispatch();
    const directHref = (_href: string) => {
        // hàm này chỉ được gọi khi làm topic => trường topicId luôn có giá trị khi cần dùng đến
        dispatch(
            getStudyData({
                slug: _href.slice(1, _href.length), // bỏ dấu / vì trong này đang không xử lý dấu đó
                type: SYNC_TYPE.TYPE_LEARN_TEST,
                topicId: topicId,
            })
        );
        window.location.href = _href;
    };
    return (
        <div className="v4-end-test-container-buttons ">
            <div style={{ display: "flex" }}>
                <button
                    className={"btn v4-border-radius v4-button-animtaion " + (nextLevelHref ? "btn-theme-1" : "btn-theme-2")}
                    onClick={() => {
                        // ga.event({
                        //     action: levelTag.includes("level") ? "restart_level" : "click_restart_test",
                        //     params: { from: window.location.href, to: levelTag },
                        // });
                        dispatch(onRestartGame());
                    }}
                >
                    {levelTag.includes("level") ? "Restart Level" : "Restart Test"}
                </button>
                {nextLevelHref && (
                    <button
                        className="next-level btn v4-border-radius v4-button-animtaion"
                        onClick={() => {
                            // ga.event({
                            //     action: "next_level",
                            //     params: { from: window.location.href, to: nextLevelHref },
                            // });
                            directHref(nextLevelHref);
                            window.scrollTo({ top: 0 });
                        }}
                    >
                        Next Level
                    </button>
                )}
            </div>
            {levelTag && // cho phần topic thôi vì topic mới có trường này
                (levelTag !== "final-test" ? (
                    finalTestHref && (
                        <button
                            className="final-test btn v4-border-radius v4-button-animtaion"
                            onClick={() => {
                                // ga.event({
                                //     action: "click_final_test_end",
                                //     params: { from: window.location.href, to: finalTestHref },
                                // });
                                directHref(finalTestHref);
                            }}
                        >
                            Final Test
                        </button>
                    )
                ) : (
                    <button
                        className="final-test btn v4-border-radius v4-button-animtaion"
                        onClick={() => {
                            window.location.href = `/full-length-${APP_SHORT_NAME}-practice-test`;
                        }}
                    >
                        Full-length Test
                    </button>
                ))}
        </div>
    );
};

const ProgressBar = ({ score, target, isEndLevel }: { score: number; target: number; isEndLevel: boolean }) => {
    return (
        <div className="v4-progress">
            <div
                className="v4-line-progress v4-border-radius"
                style={{ backgroundColor: isEndLevel ? "#fb7072" : "rgba(124, 111, 91, 0.122)" }}
            >
                <div className="v4-current-progress v4-border-radius" style={{ width: score + "%" }}></div>
            </div>
            {!isEndLevel && (
                <>
                    <div
                        className="v4-progress-target-icon"
                        style={{
                            left: `${target ?? 0}%`,
                        }}
                    >
                        <TargetIcon />
                    </div>
                    <div
                        className="v4-progress-text"
                        style={{
                            gridTemplateColumns: `${target}% 1fr`,
                        }}
                    >
                        <div className="v4-progress-text-score">
                            <span className="percent">{score}%</span>
                            <span className="text">Your score</span>
                        </div>
                        <div className="v4-progress-text-target">
                            <span className="percent">{target}%</span>
                            <span className="text" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EndTestV4;
