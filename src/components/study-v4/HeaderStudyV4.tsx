import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Config from "../../config";
import CountDownV4 from "./CountDownV4";
import * as ga from "../../services/ga";
import "./HeaderStudyV4.scss";
// import MySwipeDownDrawer from "../v4-material/MySwipeDownDrawer";
import { GameState } from "@/redux/features/game";
import { onGameSubmitted } from "@/redux/reporsitory/game.repository";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const HeaderStudyV4 = ({ gameState }: { gameState: GameState }) => {
    const dispatch = useDispatch();
    const [openDrawer, setOpendrawer] = useState(false);

    const handleExitStudy = (event: "submit" | "exit") => {
        setOpendrawer(false);
        if (event == "exit") {
            window.location.href = "/";
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
        <div className="v4-main-study-view-top-mobile-0">
            <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                    setOpendrawer(!openDrawer);
                }}
            >
                <ArrowBackIosNewRoundedIcon htmlColor="#212121" />
            </div>
            {gameState.gameType == Config.TEST_GAME && (
                <div className="v4-test-game-count-down-mobile-0">
                    <CountDownV4 gameState={gameState} />
                </div>
            )}
            {gameState.gameType == Config.STUDY_GAME && (
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
        // <MySwipeDownDrawer open={open} onClose={() => setOpen(false)} anchor="bottom" className="v4-drawer-bottom-study">

        // </MySwipeDownDrawer>
    );
};

export default HeaderStudyV4;
