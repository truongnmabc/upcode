import AppState from "@/redux/appState";
import { GameState } from "@/redux/features/game";
import IWebData from "@/types/webData";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import StudyView from "../../components/study-v4/StudyView";
import { IAppInfo } from "../../models/AppInfo";
// import { ITopic } from "../../models/Topic";
// import { ITestInfo } from "@/models/TestInfo";
const HeaderV4 = dynamic(() => import("../../components/header/HeaderV4"));

const StudyLayout = ({ appInfo, contentData }: { appInfo: IAppInfo; contentData: IWebData }) => {
    // chú ý là phần học này đã được chuyển qua build static
    const gameState: GameState = useSelector((state: AppState) => state.gameReducer.game);
    // const _listTopics: ITopic[] = useSelector((state: AppState) => state.topicReducer.list);
    // const listTopics = _listTopics.filter((t) => t && t.rootTopicId + "" === appInfo.appId + "");
    // const tests: ITestInfo[] = useSelector((state: AppState) =>
    //     state.testReducer.list.filter((t) => t.appId === appInfo.appId)
    // );
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
