"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import QuestionContent from "@/components/question";
import { MathJaxContext } from "better-react-mathjax";
import React from "react";
import EmotionComponent from "../emotion/emotionComponent";
import TimeTestGetLever from "../timeTest";
import ProgressQuestion from "@/components/progressQuestion";
import TitleQuestion from "@/components/titleQuestion";

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

                <BottomActions isShow={true} type="diagnostic" />
            </div>
        </MathJaxContext>
    );
};

export default ContentTestView;
