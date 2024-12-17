import React from "react";
import "./index.scss";
import QuestionTextContent from "@/components/study/QuestionTextContent";
import { TextContentType } from "@/utils/v0_question";
import Question from "@/models/Question";
import QuestionMultipleChoice from "@/components/study/QuestionMultipleChoice";

const ANSWERS = { 1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H", 9: "I", 10: "J" };

const PrintQuestion = ({ bucket, question, index }: { bucket: string; question: Question; index: number }) => {
    let contentQuestion = question.question;
    const isMultichoices = question.correctNums > 1;

    return (
        <div key={question.id} className="print-question-container">
            <div className="question-name">{`Question ${index + 1}:`}</div>
            <QuestionTextContent bucket={bucket} content={contentQuestion} image={question.image} place="print" />

            <QuestionTextContent
                content={question.paragraphContent ?? ""}
                type={TextContentType.explanation}
                bucket={bucket}
                place="print"
            />

            <QuestionMultipleChoice currentQuestion={question} />
            <div className="choice-print">
                {question.choices.map((choice, index) => {
                    return (
                        <div className="list-choice-print" key={index}>
                            {isMultichoices ? (
                                <div className="answer-index-checkbox" />
                            ) : (
                                <div className="answer-index-character">{ANSWERS[index + 1]}</div>
                            )}
                            <div className="answer-content-print">
                                <QuestionTextContent
                                    content={choice.content}
                                    type={TextContentType.answer}
                                    bucket={bucket}
                                    place="print"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PrintQuestion;
