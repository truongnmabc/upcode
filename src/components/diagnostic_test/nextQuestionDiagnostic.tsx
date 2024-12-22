import { MtUiButton } from "@/components/button";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";

import React from "react";
const NextQuestionDiagnostic = () => {
    const { currentGame } = useAppSelector(gameState);

    const dispatch = useAppDispatch();

    const handleFinish = () => dispatch(nextQuestionDiagnosticThunk());

    return (
        <MtUiButton
            animated
            block
            onClick={handleFinish}
            disabled={!currentGame?.selectedAnswer}
            type="primary"
            className="py-3 px-8"
        >
            Continue
        </MtUiButton>
    );
};
export default React.memo(NextQuestionDiagnostic);
