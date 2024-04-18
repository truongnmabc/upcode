import { useState } from "react";
import Config from "../../config";
import { getSession } from "../../config/config_web";
import Question from "../../models/Question";
import { TextContentType, decryptExplanation, isMathJaxContent } from "../../utils/v4_question";
import MyCollapse from "../v4-material/MyCollapse";
import ChoicesPanelV4 from "./ChoicesPanelV4";
import QuestionMultipleChoiceV4 from "./QuestionMultipleChoiceV4";
import "./QuestionPanelV4.scss";
import V4QuestionContent from "./V4QuestionContent";
const tester = getSession(Config.TESTER_KEY);
const QuestionPanelV4 = ({
    question,
    appInfoBucket,
    allowShowAnswer = true,
    place,
    index = -1,
}: {
    question: Question;
    appInfoBucket: string;
    allowShowAnswer?: boolean;
    place: "question" | "study" | "review";
    index?: number;
}) => {
    const [expandParagraph, setExpandParagraph] = useState(false);
    let explanationContent = decryptExplanation(question.explanation);
    let contentQuestion = decryptExplanation(question.question);
    // if (!isProUser) explanationContent = hashText(explanationContent);
    return (
        <div className="v4-question-panel">
            {tester && question.id}
            <div className="v4-question-panel-content v4-border-radius">
                <V4QuestionContent
                    content={(index > -1 ? index + ". " : "") + contentQuestion}
                    bucket={appInfoBucket}
                    renderMathJax={isMathJaxContent(contentQuestion)}
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
                            content={explanationContent}
                            type={TextContentType.explanation}
                            bucket={appInfoBucket}
                            renderMathJax={isMathJaxContent(explanationContent)}
                            place={place}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionPanelV4;
