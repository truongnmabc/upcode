import CloseIcon from "@/asset/icon/CloseIcon";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import ProgressQuestion from "@/components/study/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/question";
import { startRandomReview } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { useCallback } from "react";
import BottomActionGroup from "./bottom";

const RandomGameContent = () => {
    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-center ">
                        <h3 className="text-xl font-semibold ">
                            Random Questions
                        </h3>
                    </div>
                    <ProgressQuestion />
                    <QuestionContent />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>
                <BottomActionGroup />
            </div>
        </MathJaxContext>
    );
};

export default React.memo(RandomGameContent);
