import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import QuestionContent from "@/components/question";
import { MathJaxContext } from "better-react-mathjax";
import React, { useContext } from "react";
import ProgressQuestion from "@/components/progressQuestion";
import { ReviewContext } from "../../context";
import BottomActions from "@/components/bottomActions";

const RandomGameContent = () => {
    const { selectType } = useContext(ReviewContext);

    return (
        <MathJaxContext>
            <div className="sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="p-0 sm:p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-center ">
                        <h3 className="text-xl capitalize font-semibold ">
                            {selectType} Questions
                        </h3>
                    </div>
                    <ProgressQuestion />
                    <QuestionContent />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>
                <BottomActions type="review" />
            </div>
        </MathJaxContext>
    );
};

export default React.memo(RandomGameContent);
