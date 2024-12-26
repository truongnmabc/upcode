import LazyLoadImage from "@/components/images";
import SubAction from "@/components/study/contentGroup/mainStudyView/bottomBtn/subAction";
import ChoicesPanel from "@/components/study/contentGroup/mainStudyView/choicesPanel/choicesPanel";
import ExplanationDetail from "@/components/study/contentGroup/mainStudyView/explanation/explanationDetail";
import QuestionContent from "@/components/study/contentGroup/mainStudyView/question/questionContent";
import React from "react";
import { MathJaxContext } from "better-react-mathjax";
import { ICurrentGame } from "@/models/game/game";

const QuestionResult = ({ item }: { item: ICurrentGame }) => {
    return (
        <div
            className="rounded-lg"
            style={{
                boxShadow: " 0px 2px 8px 0px #21212129",
            }}
        >
            <div className="w-full rounded-t-lg bg-[#FFFBE1] flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <LazyLoadImage classNames="w-8 h-8" src="/" />
                    <p className="text-base font-medium ">
                        Mechanical Comprehension
                    </p>
                </div>
                <div>
                    <SubAction />
                </div>
            </div>
            <div className="rounded-b-lg bg-white p-4">
                <MathJaxContext>
                    <QuestionContent />
                    <ChoicesPanel isBlockEnter />
                    <ExplanationDetail unLock />
                </MathJaxContext>
            </div>
        </div>
    );
};

export default QuestionResult;
