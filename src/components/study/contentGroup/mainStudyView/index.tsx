"use client";
import ClockIcon from "@/components/icon/ClockIcon";
import { MathJaxContext } from "better-react-mathjax";
import { useSearchParams } from "next/navigation";
import React from "react";
import BottomBtn from "./bottomBtn/bottomBtn";
import ChoicesPanel from "./choicesPanel/choicesPanel";
import CountTimeRemain from "./countTime";
import ExplanationDetail from "./explanation/explanationDetail";
import ProgressQuestion from "./progress/progressQuestion";
import QuestionContent from "./question/questionContent";
import TitleQuestion from "./title/titleQuestion";

const FN = () => {
    const type = useSearchParams().get("type");

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    <TitleQuestion />
                    <ProgressQuestion />
                    {type === "test" && (
                        <div className="w-full flex items-center justify-center">
                            <div className="flex items-center justify-center w-fit gap-2">
                                <ClockIcon />
                                <CountTimeRemain />
                            </div>
                        </div>
                    )}

                    <QuestionContent />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>

                <BottomBtn />
            </div>
        </MathJaxContext>
    );
};
const MainStudyView = React.memo(FN);
export default MainStudyView;
