"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import {
    selectFeedBack,
    selectIndexSubTopic,
} from "@/redux/features/game.reselect";
import { useAppSelector } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React from "react";
import CountTimeCustomTest from "../countTimeCustomTest";

const ContentCustomTest = () => {
    const feedBack = useAppSelector(selectFeedBack);
    const indexSubTopic = useAppSelector(selectIndexSubTopic);

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    <div className="w-full hidden sm:block text-center capitalize text-xl font-semibold">
                        Custom Test {indexSubTopic}
                    </div>
                    <ProgressQuestion />
                    <CountTimeCustomTest />
                    <QuestionContent
                        showStatus={feedBack !== "exam" ? true : false}
                    />
                    <ChoicesPanel />
                    {feedBack !== "exam" && (
                        <ExplanationDetail unLock={feedBack === "newbie"} />
                    )}
                </div>

                <BottomActions isShow={true} type="custom" />
            </div>
        </MathJaxContext>
    );
};

export default React.memo(ContentCustomTest);
