import AppState from "@/redux/appState";
import { GameState } from "@/redux/features/game";
import IWebData from "@/types/webData";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import StudyView from "../../components/study-v4/StudyView";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
const HeaderV4 = dynamic(() => import("../../components/header/HeaderV4"));

const StudyLayout = ({ appInfo, contentData }: { appInfo: IAppInfo; contentData: IWebData }) => {
    // chú ý là phần học này đã được chuyển qua build static
    const gameState: GameState = useSelector((state: AppState) => state.gameReducer.game);
    const _listTopics: ITopic[] = useSelector((state: AppState) => state.topicReducer.list);
    const listTopics = _listTopics.filter((t) => t);
    return (
        <div className="use-background">
            <div className="_769">
                <HeaderV4 appInfo={appInfo} topics={listTopics} />
            </div>
            <StudyView appInfo={appInfo} listTopics={listTopics} gameState={gameState} contentData={contentData} />
        </div>
    );
};

export default StudyLayout;
