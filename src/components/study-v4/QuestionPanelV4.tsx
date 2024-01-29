import "./QuestionPanelV4.scss";
import { TextContentType, isMathJaxContent } from "../../utils/v4_question";
import { useState } from "react";
import ChoicesPanelV4 from "./ChoicesPanelV4";
import QuestionMultipleChoiceV4 from "./QuestionMultipleChoiceV4";
import V4QuestionContent from "./V4QuestionContent";
import Question from "../../models/Question";
import MyCollapse from "../v4-material/MyCollapse";
import { getSession } from "../../config/config_web";
import Config from "../../config";
const tester = getSession(Config.TESTER_KEY);
const QuestionPanelV4 = ({
    question,
    appInfoBucket,
    allowShowAnswer = true,
    place,
}: {
    question: Question;
    appInfoBucket: string;
    allowShowAnswer?: boolean;
    place: "question" | "study" | "review";
}) => {
    const [expandParagraph, setExpandParagraph] = useState(false);
    return (
        <div className="v4-question-panel">
            {tester && question.id}
            <div className="v4-question-panel-content v4-border-radius">
                <V4QuestionContent
                    content={question.question}
                    bucket={appInfoBucket}
                    renderMathJax={isMathJaxContent(question.question)}
                    image={question.image}
                    place={place}
                />
                {question.paragraphContent?.length ? (
                    <div className="question-paragraph">
                        <div
                            style={{
                                marginBottom: "10px",
                                marginTop: "16px",
                                color: "#7c6f5b",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={(e) => {
                                setExpandParagraph(!expandParagraph);
                            }}
                        >
                            {!expandParagraph ? "Read more" : "Show less"}
                        </div>
                        <MyCollapse expand={expandParagraph}>
                            <V4QuestionContent
                                content={question.paragraphContent}
                                type={TextContentType.explanation}
                                bucket={appInfoBucket}
                                renderMathJax={isMathJaxContent(question.paragraphContent)}
                                place={place}
                            />
                        </MyCollapse>
                    </div>
                ) : (
                    <></>
                )}
            </div>

            <QuestionMultipleChoiceV4 currentQuestion={question} />
            <ChoicesPanelV4
                bucket={appInfoBucket}
                allowShowAnswer={allowShowAnswer}
                isReviewAnswer={true}
                currentQuestion={question}
            />
            <div className={"v4-explanation-detail"}>
                <div className={"v4-explanation-detail-title"}>Detailed Explanation</div>
                <div className="explanation-content-wrapper">
                    <div>
                        <V4QuestionContent
                            content={question.explanation}
                            type={TextContentType.explanation}
                            bucket={appInfoBucket}
                            renderMathJax={isMathJaxContent(question.explanation)}
                            place={place}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionPanelV4;
