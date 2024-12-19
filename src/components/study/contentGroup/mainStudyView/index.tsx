"use client";
import { MathJaxContext } from "better-react-mathjax";
import React, { Fragment } from "react";
import BottomConfigTest from "../../bottomConfirm";
import BottomBtn from "./bottomBtn/bottomBtn";
import ChoicesPanel from "./choicesPanel/choicesPanel";
import ExplanationDetail from "./explanation/explanationDetail";
import ProgressQuestion from "./progress/progressQuestion";
import QuestionContent from "./question/questionContent";
import TitleQuestion from "./title/titleQuestion";
import { useSearchParams } from "next/navigation";
import ClockIcon from "@/components/icon/ClockIcon";
import Time from "./time/time";
import ModalConfirm from "./modal/modalConfirm";

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
                                <Time />
                            </div>
                        </div>
                    )}

                    <QuestionContent />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>

                <BottomBtn />
            </div>

            {type === "test" && (
                <Fragment>
                    <BottomConfigTest />
                    <ModalConfirm />
                </Fragment>
            )}
        </MathJaxContext>
    );
};
const MainStudyView = React.memo(FN);
export default MainStudyView;
