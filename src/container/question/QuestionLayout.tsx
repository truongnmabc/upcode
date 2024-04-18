import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import QuestionPageView from "@/components/question-page/QuestionPageView";
import { GameState } from "@/redux/features/game";
import { isParentApp } from "@/config/config_web";
import { readAllAppInfos } from "@/utils/getAppInfo";
import dynamic from "next/dynamic";

const Header1 = dynamic(() => import("@/components/header/Header1"));
const HeaderV4 = dynamic(() => import("@/components/header/HeaderV4"));

const QuestionLayout = ({
    appInfo,
    anchorText,
    topic,
    gameState,
    listTopics,
    listAppInfos,
}: {
    appInfo: IAppInfo;
    anchorText: string;
    topic: ITopic;
    gameState: GameState;
    listTopics: ITopic[];
    listAppInfos: IAppInfo[];
}) => {
    const _isParentApp = isParentApp();
    return (
        <div className="use-background">
            {_isParentApp ? <Header1 listAppInfos={listAppInfos} /> : <HeaderV4 appInfo={appInfo} topics={listTopics} />}
            <QuestionPageView
                appInfo={appInfo}
                listTopics={listTopics}
                gameState={gameState}
                anchorText={anchorText}
                topic={topic}
            />
        </div>
    );
};

export default QuestionLayout;
