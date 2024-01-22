import AppState from "@/redux/appState";
import { GameState } from "@/redux/features/game";
import IWebData from "@/types/webData";
import useMediaQuery from "@mui/material/useMediaQuery";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import StudyView from "../../components/study-v4/StudyView";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";

const HeaderV4 = dynamic(() => import("../../components/header/HeaderV4"));

const StudyLayout = ({
    appInfo,
    listTopics,
    contentData,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    contentData: IWebData;
}) => {
    const gameState: GameState = useSelector((state: AppState) => state.gameReducer.game);
    const isDesktop = useMediaQuery("(min-width:769px)");
    return (
        <div className="use-background">
            {isDesktop && <HeaderV4 appInfo={appInfo} topics={listTopics} />}
            <StudyView appInfo={appInfo} listTopics={listTopics} gameState={gameState} contentData={contentData} />
        </div>
    );
};

export default StudyLayout;
