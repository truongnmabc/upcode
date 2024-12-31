"use client";
import NextQuestionDiagnostic from "@/components/diagnosticTest/nextQuestionDiagnostic";
import BtnSubmit from "@/components/study/mainStudyView/bottomBtn/btnSubmit";
import Keyboard from "@/components/study/mainStudyView/bottomBtn/keyboard";
import SubAction from "@/components/study/mainStudyView/bottomBtn/subAction";
import ChoicesPanel from "@/components/study/mainStudyView/choicesPanel/choicesPanel";
import ExplanationDetail from "@/components/study/mainStudyView/explanation/explanationDetail";
import ProgressQuestion from "@/components/study/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/study/mainStudyView/question/questionContent";
import TitleQuestion from "@/components/study/mainStudyView/title/titleQuestion";
import { MathJaxContext } from "better-react-mathjax";
import React from "react";
import EmotionComponent from "../emotion/emotionComponent";
import TimeTestGetLever from "../timeTest";

const ContentTestView = () => {
    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 pt-4 flex flex-col gap-3">
                    <TitleQuestion />
                    <ProgressQuestion />
                    <TimeTestGetLever />
                    <QuestionContent showStatus={false} />
                    <EmotionComponent />
                    <ChoicesPanel />
                    <ExplanationDetail unLock={true} />
                </div>

                <div className="flex fixed sm:static shadow-bottom sm:shadow-none  bottom-0 left-0 right-0 z-50 bg-theme-dark sm:px-4 sm:bg-[#7C6F5B0F] flex-col sm:flex-row pb-8 pt-3 sm:py-3 justify-between gap-2 sm:gap-4 items-center ">
                    <div className="flex  gap-2 sm:gap-8 items-center">
                        <Keyboard />
                        <SubAction />
                    </div>
                    <div className="px-4 w-full flex items-center gap-2 sm:p-4 sm:w-fit">
                        <BtnSubmit isShow />
                        <NextQuestionDiagnostic />
                    </div>
                </div>
            </div>
        </MathJaxContext>
    );
};

export default React.memo(ContentTestView);
