import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import CountTime from "@/components/countTime";
import { gameState } from "@/redux/features/game";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";

const CountTimeDiagnostic = () => {
    const dispatch = useAppDispatch();

    const { currentGame, remainTime } = useAppSelector(gameState);
    const [time, setTime] = useState(remainTime);
    const [key, setKey] = useState(0);
    const handleEndTime = () => {
        setTime(remainTime);
        setKey((prevKey) => prevKey + 1);
        dispatch(nextQuestionDiagnosticThunk());
    };

    useEffect(() => {
        if (currentGame.id !== -1) {
            setTime(remainTime);
            setKey((prevKey) => prevKey + 1);
        }
    }, [currentGame.id, remainTime]);

    return <CountTime key={key} duration={time} onEndTime={handleEndTime} />;
};

export default React.memo(CountTimeDiagnostic);
