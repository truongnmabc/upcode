import { MtUiButton } from "@/components/button";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";

import React, { useEffect, useState } from "react";
const NextQuestionDiagnostic = () => {
    const { currentGame, indexCurrentQuestion, listQuestion } =
        useAppSelector(gameState);

    const dispatch = useAppDispatch();

    const handleFinish = () => dispatch(nextQuestionDiagnosticThunk());
    if (indexCurrentQuestion + 1 === listQuestion?.length) {
        return <></>;
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
                {currentGame?.selectedAnswer?.id === -1 && <CountDown />}{" "}
                <span className="text-white">Continue</span>
            </div>
        </MtUiButton>
    );
};
export default React.memo(NextQuestionDiagnostic);

const CountDown = () => {
    const [count, setCount] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (count === 0) return <></>;
    return <span className="text-white">{count}</span>;
};
