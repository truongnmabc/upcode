import { IAppInfo } from "../../../models/AppInfo";
import "./ReviewAnswer.scss";
import QuestionPanelV4 from "../QuestionPanelV4";
import { GameState } from "@/redux/features/game";

const ReviewAnswer = ({ gameState, appInfo }: { gameState: GameState; appInfo: IAppInfo }) => {
    const questions = gameState.questions;
    return (
        <div className="v4-review-answer">
            <div className="v4-review-answer-title">Review Your Answers</div>
            <div className="v4-review-answer-questions">
                {questions.map((question) => (
                    <div className="v4-review-answer-question" key={question.id}>
                        <QuestionPanelV4 appInfoBucket={appInfo.bucket} question={question} place="review" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewAnswer;
