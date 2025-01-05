import CloseIcon from "@/asset/icon/CloseIcon";
import ChoicesPanel from "@/components/study/mainStudyView/choicesPanel/choicesPanel";
import ExplanationDetail from "@/components/study/mainStudyView/explanation/explanationDetail";
import ProgressQuestion from "@/components/study/mainStudyView/progress/progressQuestion";
import QuestionContent from "@/components/study/mainStudyView/question/questionContent";
import { startRandomReview } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { useCallback } from "react";
import BottomActionGroup from "./bottom";

const RandomGameContent = ({
    setIsStart,
}: {
    setIsStart: (e: boolean) => void;
}) => {
    const dispatch = useAppDispatch();

    const handleClose = useCallback(() => {
        dispatch(
            startRandomReview({
                listQuestion: [],
            })
        );
        setIsStart(false);
    }, [dispatch, setIsStart]);

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between ">
                        <div onClick={handleClose}>
                            <CloseIcon />
                        </div>
                        <h3 className="text-xl font-semibold ">
                            Random Questions
                        </h3>
                        <p></p>
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
