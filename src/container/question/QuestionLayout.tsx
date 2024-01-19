import HeaderV4 from "@/components/header/HeaderV4";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import QuestionPageView from "@/components/question-page/QuestionPageView";
import { GameState } from "@/redux/features/game";

const QuestionLayout = ({
    appInfo,
    anchorText,
    topic,
    gameState,
    listTopics,
}: {
    appInfo: IAppInfo;
    anchorText: string;
    topic: ITopic;
    gameState: GameState;
    listTopics: ITopic[];
}) => {
    return (
        <div className="use-background">
            <HeaderV4 appInfo={appInfo} topics={listTopics} />
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
