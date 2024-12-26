"use client";
import ClockIcon from "@/components/icon/ClockIcon";
import BtnSubmit from "@/components/study/contentGroup/mainStudyView/bottomBtn/btnSubmit";
import Keyboard from "@/components/study/contentGroup/mainStudyView/bottomBtn/keyboard";
import SubAction from "@/components/study/contentGroup/mainStudyView/bottomBtn/subAction";
import ChoicesPanel from "@/components/study/contentGroup/mainStudyView/choicesPanel/choicesPanel";
import ExplanationDetail from "@/components/study/contentGroup/mainStudyView/explanation/explanationDetail";
import ProgressQuestion from "@/components/study/contentGroup/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/study/contentGroup/mainStudyView/question/questionContent";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { Fragment } from "react";
import CountTimeCustomTest from "../countTimeCustomTest";
import NextQuestionCustomTest from "../nextQuestionCustomTest";

const ContentCustomTest = () => {
    const { feedBack, indexSubTopic } = useAppSelector(gameState);

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <Fragment>
                    <div className="sm:p-4 flex flex-col gap-3">
                        <div className="w-full hidden sm:block text-center capitalize text-xl font-semibold">
                            Custom Test {indexSubTopic}
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
                    <div className="flex fixed sm:static shadow-bottom sm:shadow-none  bottom-0 left-0 right-0 z-50 bg-theme-dark sm:px-4 sm:bg-[#7C6F5B0F] flex-col sm:flex-row pb-8 pt-3 sm:py-3 justify-between gap-2 sm:gap-4 items-center ">
                        <div className="flex  gap-2 sm:gap-8 items-center">
                            <Keyboard />
                            <SubAction />
                        </div>
                        <div className="px-4 w-full flex items-center gap-2 sm:p-4 sm:w-fit">
                            <BtnSubmit isShow={true} />
                            <NextQuestionCustomTest />
                        </div>
                    </div>
                </Fragment>
            </div>
        </MathJaxContext>
    );
};

export default React.memo(ContentCustomTest);
