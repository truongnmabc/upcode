"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import ClockIcon from "@/components/icon/ClockIcon";
import QuestionContent from "@/components/question";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { Fragment } from "react";
import CountTimeCustomTest from "../countTimeCustomTest";
import ProgressQuestion from "@/components/progressQuestion";

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

                    <BottomActions isShow={true} type="custom" />
                </Fragment>
            </div>
        </MathJaxContext>
    );
};

export default React.memo(ContentCustomTest);
