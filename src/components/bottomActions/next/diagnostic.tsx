import { MtUiButton } from "@/components/button";
import {
    selectCurrentGame,
    selectCurrentQuestionIndex,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";

import React from "react";
const NextQuestionDiagnostic = () => {
    const currentGame = useAppSelector(selectCurrentGame);
    const listQuestion = useAppSelector(selectListQuestion);
    const currentQuestionIndex = useAppSelector(selectCurrentQuestionIndex);
    const dispatch = useAppDispatch();

    const handleFinish = () => dispatch(nextQuestionDiagnosticThunk());
    if (currentQuestionIndex + 1 === listQuestion?.length) {
        return null;
    }
    return (
        <MtUiButton
            animated
            block
            onClick={handleFinish}
            disabled={!currentGame?.selectedAnswer}
            type="primary"
            className="py-3 px-8"
        >
            <div className="flex gap-1 items-center">
                <span className="text-white">Continue</span>
            </div>
        </MtUiButton>
    );
};
export default React.memo(NextQuestionDiagnostic);
