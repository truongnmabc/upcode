"use client";
import BottomActions, { IPropsType } from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import ClockIcon from "@/components/icon/ClockIcon";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import TitleQuestion from "@/components/titleQuestion";
import { MathJaxContext } from "better-react-mathjax";
import { useSearchParams } from "next/navigation";
import React from "react";
import LoadDataStudy from "../loadData";
import CountTimeRemainPracticeTest from "./countTimeTest";

const MainStudyView = () => {
    const type = useSearchParams()?.get("type") as IPropsType;

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    {type && <TitleQuestion type={type} />}
                    <ProgressQuestion />
                    {type === "test" && (
                        <div className="w-full flex items-center justify-center">
                            <div className="flex items-center justify-center w-fit gap-2">
                                <ClockIcon />
                                <CountTimeRemainPracticeTest />
                            </div>
                        </div>
                    )}
                    <QuestionContent showStatus={type === "learn"} />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>

                <BottomActions type={type} />
            </div>
            <LoadDataStudy />
        </MathJaxContext>
    );
};
export default React.memo(MainStudyView);
