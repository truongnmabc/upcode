"use client";
import BottomBtn from "@/components/study/contentGroup/mainStudyView/bottomBtn/bottomBtn";
import ChoicesPanel from "@/components/study/contentGroup/mainStudyView/choicesPanel/choicesPanel";
import ProgressQuestion from "@/components/study/contentGroup/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/study/contentGroup/mainStudyView/question/questionContent";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";

import ExplanationDetail from "@/components/study/contentGroup/mainStudyView/explanation/explanationDetail";
import React, { Fragment } from "react";
import ClockIcon from "@/components/icon/ClockIcon";
import CountTimeCustomTest from "../countTimeCustomTest";

const ContentCustomTest = () => {
    const { feedBack } = useAppSelector(gameState);

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <Fragment>
                    <div className="sm:p-4 flex flex-col gap-3">
                        <div className="w-full hidden sm:block text-center capitalize text-xl font-semibold">
                            Custom Test
                        </div>
                        <ProgressQuestion />
                        <div className="w-full flex items-center justify-center">
                            <div className="flex items-center justify-center w-fit gap-2">
                                <ClockIcon />
                                <CountTimeCustomTest />
                            </div>
                        </div>
                        <QuestionContent
                            showStatus={feedBack !== "exam" ? true : false}
                        />
                        <ChoicesPanel />
                        {feedBack !== "exam" && (
                            <ExplanationDetail unLock={feedBack === "newbie"} />
                        )}
                    </div>
                    <BottomBtn />
                </Fragment>
            </div>
        </MathJaxContext>
    );
};

export default React.memo(ContentCustomTest);
