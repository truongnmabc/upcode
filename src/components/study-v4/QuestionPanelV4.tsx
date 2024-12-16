import { useState } from "react";
import Config from "../../config";
import { getSession } from "../../config/config_web";
import Question from "../../models/Question";
import { TextContentType, decryptExplanation, hashText, isMathJaxContent } from "../../utils/v4_question";
import MyCollapse from "../v4-material/MyCollapse";
import ChoicesPanelV4 from "./ChoicesPanelV4";
import QuestionMultipleChoiceV4 from "./QuestionMultipleChoiceV4";
import "./QuestionPanelV4.scss";
import V4QuestionContent from "./V4QuestionContent";
import { useSelector } from "react-redux";
import AppState from "@/redux/appState";
import { genLinkPro } from "@/services/home.service";
import { IAppInfo } from "@/models/AppInfo";
const tester = getSession(Config.TESTER_KEY);
const QuestionPanelV4 = ({
    question,
    appInfo,
    allowShowAnswer = true,
    place,
    index = -1,
}: {
    question: Question;
    appInfo: IAppInfo;
    allowShowAnswer?: boolean;
    place: "question" | "study" | "review";
    index?: number;
}) => {
    const isPro = useSelector((state: AppState) => state.userReducer.isPro);
    const [expandParagraph, setExpandParagraph] = useState(false);
    let explanationContent = decryptExplanation(question.explanation);
    let contentQuestion = decryptExplanation(question.question);
    if (!isPro) explanationContent = hashText(explanationContent);
    const onClickPro = () => {
        if (!isPro) {
            let linkPro = genLinkPro(appInfo);
            window.open(linkPro, "_blank");
        }
    };
    return (
        <div className="v4-question-panel">
            {tester && question.id}
            <div className="v4-question-panel-content v4-border-radius">
                <V4QuestionContent
                    content={(index > -1 ? index + ". " : "") + contentQuestion}
                    bucket={appInfo.bucket}
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
                                bucket={appInfo.bucket}
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
                bucket={appInfo.bucket}
                allowShowAnswer={allowShowAnswer}
                isReviewAnswer={true}
                currentQuestion={question}
            />
            <div className={"v4-explanation-detail"}>
                <div className={"v4-explanation-detail-title align-center"}>
                    Detailed Explanation&nbsp;
                    {!isPro && (
                        <>
                            <span className="_769">
                                (Get &nbsp;
                                <img src="/images/passemall/pro_icon.svg" className="pro-img" width={48} onClick={onClickPro} />
                                &nbsp; to show this content)
                            </span>
                            <img
                                src="/images/passemall/pro-content.png"
                                className="pro-img __768"
                                width={86}
                                height={19}
                                onClick={onClickPro}
                            />
                        </>
                    )}
                </div>
                <div className={"explanation-content-wrapper " + (isPro ? "" : "blur-content")} onClick={onClickPro}>
                    <div>
                        <V4QuestionContent
                            content={explanationContent}
                            type={TextContentType.explanation}
                            bucket={appInfo.bucket}
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
