import { APP_SHORT_NAME } from "@/config_app";
import { IAppInfo } from "@/models/AppInfo";
import Question from "@/models/Question";
import { TextContentType, renderMath } from "@/utils/v0_question";
import React, { useEffect, useState } from "react";
import "./index.scss";
import PrintQuestion from "./print-question";
import QuestionTextContent from "@/components/study/QuestionTextContent";

const genTitle = (index) => {
    return String.fromCharCode(index + 65);
};

const getPageMargins = () => {
    return `@page { margin: ${58}px ${29}px ${58}px ${29}px !important; }`;
};

const PrintPdf = React.forwardRef(
    ({ appInfo, name, questionData }: { appInfo: IAppInfo; name: string; questionData: Question[] }, ref: any) => {
        const questions = questionData;
        const [hostname, setHostname] = useState("");
        const genResult = (question) => {
            let result = 1;
            question.choices.map((choice, index) => {
                if (choice.isCorrect === true) {
                    result = index;
                }
            });
            return genTitle(result);
        };

        useEffect(() => {
            if (typeof window !== "undefined") {
                setHostname(window.location.hostname);
            }
        }, []);

        useEffect(() => {
            const timeout = setTimeout(() => {
                if (appInfo.usingMathJax && questions?.length) {
                    renderMath();
                }
            }, 2500);
            return () => clearTimeout(timeout);
        }, [questions?.length]);

        return (
            <div ref={ref} className="print-pdf-screen-container" style={appInfo.appId ? {} : { display: "block" }}>
                <div className="print-header">
                    <img src={"/images/passemall/print_header.png"} className="print-header-img" />
                    <div className="print-app-info-container">
                        <img src={`/images/${APP_SHORT_NAME}/logo-dark.png`} className="print-app-logo" />
                        <div className="print-link-web">{hostname}</div>
                    </div>
                </div>
                <div className="print-topic-name">{name.replaceAll("-", " ")}</div>
                <div className="print-number-of-question">{questions?.length + " questions"}</div>
                {questions?.map((question, index) => {
                    question = new Question(question);
                    return (
                        <PrintQuestion
                            key={question?.id + "-" + index}
                            bucket={appInfo.bucket}
                            question={question}
                            index={index}
                        />
                    );
                })}
                <div className="page-break">Answer:</div>
                {questions?.map((question, index) => {
                    return (
                        <div key={question.id} className="print-result-container">
                            <div className="print-answer-text">{`Question ${index + 1}: ${genResult(question)}`}</div>
                            {question.explanation?.trim().length ? (
                                <>
                                    <div className="print-explanation-text">Explanation:</div>
                                    <div className="print-explanation-content">
                                        <QuestionTextContent
                                            content={question.explanation}
                                            type={TextContentType.explanation}
                                            bucket={appInfo.bucket}
                                            place="print"
                                        />
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    );
                })}
                <style>{getPageMargins()}</style>
            </div>
        );
    }
);

PrintPdf.displayName = "PrintPdf"; // khai báo như này để lúc build không bị lỗi
export default PrintPdf;
