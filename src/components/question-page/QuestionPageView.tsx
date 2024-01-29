import dynamic from "next/dynamic";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { GameState } from "../../redux/features/game";
import "./QuestionPageView.scss";
const GridTopic = dynamic(() => import("../homepage/GridTopic"));
const DownloadAppV4 = dynamic(() => import("../homepage/DownloadAppV4"));
import StudyBannerDownloadApp from "../study-v4/StudyBannerDownloadApp";
import MainQuestionPageView from "./MainQuestionPageView";
import MyContainer from "../v4-material/MyContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { isParentApp } from "@/config/config_web";
const QuestionPageView = ({
    appInfo,
    listTopics,
    gameState,
    anchorText,
    topic,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    gameState: GameState;
    anchorText: string;
    topic: ITopic;
}) => {
    const isDesktop = useMediaQuery("(min-width:769px)");
    const _isParentApp = isParentApp();
    return (
        <MyContainer>
            <div className="v4-question-main-view-0">
                {isDesktop && (
                    <div className="v4-question-main-view-left-bar-0">
                        {!_isParentApp && (
                            <div className="v4-left-banner-download-0 v4-border-radius">
                                <h3 className="v4-font-semi-bold">{`Get all ${
                                    appInfo.totalQuestion
                                }+ ${appInfo.appName.toUpperCase()} exam-like questions with our mobile apps!`}</h3>
                                <DownloadAppV4 appInfo={appInfo} direction="row" size="m" place="question" />
                            </div>
                        )}
                        <div className="v4-question-list-topics-0">
                            <h3 className="v4-font-semi-bold">{`More ${appInfo.appName} Topics`}</h3>
                            <GridTopic
                                listTopics={listTopics}
                                highlightedTopicId={gameState.id}
                                appInfo={appInfo}
                                priority={4}
                            />
                        </div>
                    </div>
                )}
                <div className="v4-question-main-view-1">
                    <MainQuestionPageView
                        gameState={gameState}
                        appInfo={appInfo}
                        currentTopic={topic}
                        anchorText={anchorText}
                    />
                    {isDesktop ? <></> : <StudyBannerDownloadApp appInfo={appInfo} place="question" />}
                </div>
            </div>
        </MyContainer>
    );
};

export default QuestionPageView;
