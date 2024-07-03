import QuestionPageView from "@/components/question-page/QuestionPageView";
import { isParentApp } from "@/config/config_web";
import { GameState } from "@/redux/features/game";
import dynamic from "next/dynamic";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";

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
            {_isParentApp ? (
                <Header1 listAppInfos={listAppInfos} />
            ) : (
                <HeaderV4 appInfo={appInfo} topics={listTopics} tests={[]} />
            )}
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
