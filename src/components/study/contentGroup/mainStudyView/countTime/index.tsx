import CountTime from "@/components/countTime";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";
import React from "react";

const CountTimeRemain = () => {
    const dispatch = useAppDispatch();

    const { remainTime } = useAppSelector(gameState);

    const handleEndTime = () => dispatch(nextQuestionDiagnosticThunk());

    return <CountTime duration={remainTime} onEndTime={handleEndTime} />;
};

export default React.memo(CountTimeRemain);
