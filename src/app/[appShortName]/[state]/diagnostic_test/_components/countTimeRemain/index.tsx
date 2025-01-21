import CountTime from "@/components/countTime";
import {
    selectCurrentGame,
    selectIndexCurrentQuestion,
    selectListQuestion,
    selectRemainTime,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import choiceAnswer from "@/redux/repository/game/choiceAnswer/choiceAnswer";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";
import RouterApp from "@/constants/router.constant";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

const CountTimeDiagnostic = () => {
    const dispatch = useAppDispatch();
    const currentGame = useAppSelector(selectCurrentGame);
    const remainTime = useAppSelector(selectRemainTime);
    const listQuestion = useAppSelector(selectListQuestion);
    const indexCurrentQuestion = useAppSelector(selectIndexCurrentQuestion);
    const listLength = listQuestion?.length || 0;
    const router = useRouter();

    const handleEndTime = useCallback(() => {
        if (indexCurrentQuestion + 1 === listLength) {
            dispatch(finishDiagnosticThunk());
            router.replace(RouterApp.ResultTest, { scroll: true });
        } else {
            if (!currentGame.selectedAnswer) {
                dispatch(
                    choiceAnswer({
                        question: currentGame,
                        choice: {
                            correct: false,
                            explanation: "",
                            id: -1,
                            index: -1,
                            text: "",
                            turn: 1,
                        },
                    })
                );
            }
        }
    }, [indexCurrentQuestion, listLength, dispatch, currentGame, router]);

    return (
        <CountTime
            isPause={currentGame?.selectedAnswer ? true : false}
            key={currentGame?.id}
            duration={remainTime}
            onEndTime={handleEndTime}
        />
    );
};

export default React.memo(CountTimeDiagnostic);
