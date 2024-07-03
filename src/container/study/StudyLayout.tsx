import AppState from "@/redux/appState";
import { GameState } from "@/redux/features/game";
import IWebData from "@/types/webData";
import { useSelector } from "react-redux";
import StudyView from "../../components/study-v4/StudyView";
import { IAppInfo } from "../../models/AppInfo";
import HeaderV4 from "../../components/header/HeaderV4";

const StudyLayout = ({ appInfo, contentData }: { appInfo: IAppInfo; contentData: IWebData }) => {
    const gameState: GameState = useSelector((state: AppState) => state.gameReducer.game);
    return (
        <div className="use-background">
            <div className="_769">
                <HeaderV4 appInfo={appInfo} topics={contentData.topics} tests={contentData.tests} />
            </div>
            <StudyView
                appInfo={appInfo}
                listTopics={contentData.topics}
                gameState={gameState}
                contentData={contentData}
                tests={contentData.tests}
            />
        </div>
    );
};

export default StudyLayout;
