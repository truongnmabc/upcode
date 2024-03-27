import { IAppInfo } from "../../../models/AppInfo";
import "./ReviewAnswer.scss";
import QuestionPanelV4 from "../QuestionPanelV4";
import { GameState } from "@/redux/features/game";
import { useEffect } from "react";
import { renderMath } from "@/utils/v4_question";

const ReviewAnswer = ({ gameState, appInfo }: { gameState: GameState; appInfo: IAppInfo }) => {
    const questions = gameState.questions;
    useEffect(() => {
        if (appInfo.usingMathJax) {
            if (window.MathJax) {
                renderMath(); // vì nội dung mathjax tải lâu hơn nên phải truyền hàm này vào
            } else {
                setTimeout(() => {
                    renderMath();
                }, 1500);
            }
        }
    }, [JSON.stringify(gameState)]);
    return (
        <div className="v4-review-answer">
            <div className="v4-review-answer-title">Review Your Answers</div>
            <div className="v4-review-answer-questions">
                {questions.map((question, index) => {
                    // question = { ...question, question: question.question };
                    return (
                        <div className="v4-review-answer-question" key={question.id}>
                            <QuestionPanelV4
                                appInfoBucket={appInfo.bucket}
                                question={question}
                                place="review"
                                index={index + 1}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewAnswer;
