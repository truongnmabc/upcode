import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Config from "../../config";
import CountDownV4 from "./CountDownV4";
import * as ga from "../../services/ga";
import "./HeaderStudyV4.scss";
import { GameState } from "@/redux/features/game";
import { onGameSubmitted } from "@/redux/reporsitory/game.repository";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MyContainer from "../v4-material/MyContainer";
import { IAppInfo } from "@/models/AppInfo";
import { isParentApp } from "@/config/config_web";
import { getLink } from "@/utils";

const HeaderStudyV4 = ({
    gameState,
    isTopicTest,
    appInfo,
}: {
    gameState: GameState;
    isTopicTest: boolean;
    appInfo: IAppInfo;
}) => {
    const dispatch = useDispatch();
    const [openDrawer, setOpendrawer] = useState(false);

    const handleExitStudy = (event: "submit" | "exit") => {
        setOpendrawer(false);
        if (event == "exit") {
            let stateName = localStorage.getItem("stateSlug");
            let url = "/";
            if (isParentApp()) {
                url = getLink(appInfo, stateName);
            }
            window.location.href = url;
        }
        if (event == "submit") {
            ga.event({
                action: "drawer_submit_mobile",
                params: { from: window.location.href },
            });
            dispatch(onGameSubmitted());
        }
    };
    return (
        <>
            <MyContainer style={{ background: "#fff" }}>
                <div className="v4-main-study-view-top-mobile-0">
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setOpendrawer(!openDrawer);
                        }}
                    >
                        <ArrowBackIosNewRoundedIcon htmlColor="#212121" />
                    </div>
                    {!isTopicTest && (
                        <div className="v4-test-game-count-down-mobile-0">
                            <CountDownV4 gameState={gameState} />
                        </div>
                    )}
                    {isTopicTest && (
                        <div className="v4-test-game-level-tag-mobile-0">{gameState.levelTag.replace("-", " ").trim()}</div>
                    )}
                    <span className=" right ">{`Q${gameState.indexActive + 1}/${gameState.questions.length}`}</span>
                    <MobileDrawerConfirmExit
                        open={openDrawer}
                        setOpen={setOpendrawer}
                        handleEvent={handleExitStudy}
                        allowSubmit={!gameState.levelTag.includes("level")}
                    />
                </div>
            </MyContainer>
            {isTopicTest && <LevelGameProgress gameState={gameState} />}
        </>
    );
};

const MobileDrawerConfirmExit = ({
    open,
    setOpen,
    handleEvent,
    allowSubmit,
}: {
    open: boolean;
    setOpen: (agr: boolean) => void;
    handleEvent: (event: "submit" | "exit") => void;
    allowSubmit: boolean;
}) => {
    return (
        <SwipeableDrawer
            open={open}
            onClose={() => setOpen(false)}
            anchor="bottom"
            onOpen={() => setOpen(true)}
            className="customize-swipeable-drawer-bottom"
        >
            <div className="v4-drawer-bottom-study">
                <div className="v4-swipable-drawer-bottom-0">
                    <div className="v4-puller"></div>
                    <div className="really-want-to-exit">Do you really want to exit?</div>
                    <div className="progress-will-be-saved">Your progress will be saved!</div>
                    <div className="v4-swipable-drawer-bottom-button">
                        {allowSubmit && (
                            <div
                                className="v4-bottom-submit"
                                onClick={() => {
                                    handleEvent("submit");
                                }}
                            >
                                Submit
                            </div>
                        )}
                        <div
                            className="v4-bottom-exit"
                            onClick={() => {
                                handleEvent("exit");
                            }}
                        >
                            Exit
                        </div>
                    </div>
                </div>
            </div>
        </SwipeableDrawer>
    );
};

const LevelGameProgress = ({ gameState }: { gameState: GameState }) => {
    let numOfCorrectAnswer = 0;
    let numOfLearningAnswer = 0;
    let totalQuestion = gameState.questions.length;
    gameState.questions.forEach((q) => {
        // điều kiện tương tự phần (**#**) bên MainStudyView
        if (q.questionStatus == Config.QUESTION_ANSWERED_CORRECT) {
            numOfCorrectAnswer++; // nếu trả lời đúng câu này
        } else if (q.questionStatus == Config.QUESTION_ANSWERED_INCORRECT) {
            numOfLearningAnswer++; // nếu trả lời sai câu này
        } else if (q.questionStatus == Config.QUESTION_NOT_ANSWERED) {
            // nếu chưa trả lời câu này (2 tình huống cần xét)
            if (gameState.answeredQuestionIds.includes(q.id)) {
                //trả lời lại:
                if (gameState.arrayIndexWrong.includes(q.index)) {
                    // [trả lời sai trước đó]
                    numOfLearningAnswer++;
                } else {
                    //[trả lời đúng nhưng random lại khi mà tiếp tục sai câu cuối cùng]
                    numOfCorrectAnswer++;
                }
            }
        }
    });
    return (
        <div style={{ height: "4px", background: "rgba(33, 33, 33, 0.2)", width: "100%", display: "flex" }}>
            <div
                style={{
                    width: totalQuestion == 0 ? 0 : (numOfCorrectAnswer * 100) / totalQuestion + "%",
                    background: "#00E291",
                    transition: "0.1s width",
                }}
            />
            <div
                style={{
                    width: totalQuestion == 0 ? 0 : (numOfLearningAnswer * 100) / totalQuestion + "%",
                    background: gameState.levelTag.includes("level") ? "#EBAD34" : "#F58383",
                    transition: "0.1s width",
                }}
            />
        </div>
    );
};
export default HeaderStudyV4;
