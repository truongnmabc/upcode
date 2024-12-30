import RouterApp from "@/common/router/router.constant";
import CountTime from "@/components/countTime";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import choiceAnswer from "@/redux/repository/game/choiceAnswer/choiceAnswer";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

const CountTimeDiagnostic = () => {
    const dispatch = useAppDispatch();
    const { currentGame, remainTime, listQuestion, indexCurrentQuestion } =
        useAppSelector(gameState);
    const { appInfo } = useAppSelector(appInfoState);

    const listLength = listQuestion?.length || 0;
    const router = useRouter();

    const handleEndTime = useCallback(() => {
        if (indexCurrentQuestion + 1 === listLength) {
            dispatch(finishDiagnosticThunk());

            const _href = revertPathName({
                href: RouterApp.ResultTest,
                appName: appInfo.appShortName,
            });

            router.replace(_href, { scroll: true });
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

            setTimeout(() => {
                dispatch(nextQuestionDiagnosticThunk());
            }, 3000);
        }
    }, [
        indexCurrentQuestion,
        listLength,
        dispatch,
        currentGame,
        appInfo,
        router,
    ]);

    return (
        <CountTime
            key={currentGame?.id}
            duration={remainTime}
            onEndTime={handleEndTime}
        />
    );
};

export default React.memo(CountTimeDiagnostic);
