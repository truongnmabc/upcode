import { APP_SHORT_NAME } from "../../config_app";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { GameState } from "../../redux/features/game";
import "./MainQuestionPageView.scss";
import QuestionPanelV4 from "../study-v4/QuestionPanelV4";
import Link from "next/link";

const MainQuestionPageView = ({
    gameState,
    appInfo,
    currentTopic,
    anchorText,
}: {
    gameState: GameState;
    appInfo: IAppInfo;
    currentTopic?: ITopic;
    anchorText: string;
}) => {
    let currentQuestion = gameState.currentQuestion;
    return (
        <div className="v4-main-question-view-0">
            <div className="v4-question-title">{gameState.gameTitle}</div>
            <div className="v4-main-question-view-1 v4-border-radius">
                <QuestionPanelV4 appInfo={appInfo} question={currentQuestion} place="question" />
                <div className="v4-main-question-view-btn-wrapper" style={{ textAlign: "right" }}>
                    <button
                        className="v4-main-question-view-btn-0 v4-border-radius v4-button-animtaion"
                        onClick={() => {
                            window.location.href = `/${APP_SHORT_NAME}-${currentTopic?.tag}-practice-test`;
                        }}
                    >
                        Next Question
                    </button>
                </div>
                <div style={{ textAlign: "right", paddingTop: "8px", fontSize: "16px", lineHeight: "24px" }}>
                    <i>
                        Take more free practice tests for other ASVAB topics with our{" "}
                        <Link href="/" prefetch>
                            {anchorText}
                        </Link>{" "}
                        now!
                    </i>
                </div>
            </div>
        </div>
    );
};

export default MainQuestionPageView;
