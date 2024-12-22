import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import CountTime from "@/components/countTime";
import { gameState } from "@/redux/features/game";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";

const CountTimeRemain = () => {
    const dispatch = useAppDispatch();

    const { remainTime } = useAppSelector(gameState);

    const handleEndTime = () => dispatch(nextQuestionDiagnosticThunk());

    return <CountTime duration={remainTime} onEndTime={handleEndTime} />;
};

export default React.memo(CountTimeRemain);
