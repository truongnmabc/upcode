import { MtUiButton } from "@/components/button";
import RouterApp from "@/constants/router.constant";
import {
    selectCurrentGame,
    selectCurrentQuestionIndex,
    selectCurrentSubTopicProgressId,
    selectCurrentTopicId,
    selectIsTimeUp,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { shouldOpenSubmitTest } from "@/redux/features/tests";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishQuestionThunk from "@/redux/repository/game/finish/finishQuestion";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion/nextQuestion";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment, useCallback, useMemo } from "react";
import { IPropsBottomAction } from ".";
import { setCurrentQuestion } from "@/redux/features/game";
import nextQuestionDiagnosticThunk from "@/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest";

const WrapperBtnActions: React.FC<IPropsBottomAction> = ({
    type = "learn",
}) => {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const currentGame = useAppSelector(selectCurrentGame);
    const subTopicProgressId = useAppSelector(selectCurrentSubTopicProgressId);
    const idTopic = useAppSelector(selectCurrentTopicId);
    const listQuestion = useAppSelector(selectListQuestion);
    const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);

    const isEndTimeTest = useAppSelector(selectIsTimeUp);

    const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(true));

    const isFinish = useMemo(() => {
        if (type !== "learn") return false;

        return listQuestion.every((item) => item.localStatus === "correct");
    }, [type, listQuestion]);

    const listQuestionLength = useMemo(
        () => listQuestion.length,
        [listQuestion.length]
    );

    const isDisabled = useMemo(() => {
        if (isEndTimeTest) return true;
        const isLast = indexCurrentQuestion === listQuestionLength - 1;
        if (isLast) return true;

        // if (type === "finalTests") return false;

        if (type === "learn") return !currentGame?.selectedAnswer;
        return false;
    }, [
        currentGame,
        isEndTimeTest,
        type,
        indexCurrentQuestion,
        listQuestionLength,
    ]);

    const handleFinish = useCallback(() => {
        console.log("🚀 ~ handleFinish ~ type:", type);

        if (type === "finalTests") {
            dispatch(setCurrentQuestion(indexCurrentQuestion + 1));
            return;
        }
        if (type === "diagnosticTest") {
            dispatch(nextQuestionDiagnosticThunk());
            return;
        }
        if (type === "learn") {
            if (isFinish) {
                dispatch(
                    finishQuestionThunk({
                        subTopicProgressId,
                        topicId: idTopic,
                    })
                );

                router.replace(
                    `${RouterApp.Finish}?subTopicId=${subTopicProgressId}&topic=${params?.["slug"]}&partId=${idTopic}`,
                    { scroll: true }
                );
            } else {
                dispatch(nextQuestionThunk());
            }
        }

        if (type === "practiceTests") {
            console.log("🚀 ~ handleFinish ~ type:", type);
            // if (indexCurrentQuestion + 1 === listQuestionLength) {
            //     dispatch(finishPracticeThunk());

            //     router.push(RouterApp.ResultTest, {
            //         scroll: true,
            //     });
            // } else {
            //     dispatch(nextQuestionThunk());
            // }
        }
    }, [
        isFinish,
        dispatch,
        subTopicProgressId,
        idTopic,
        router,
        params,
        type,
        indexCurrentQuestion,
    ]);
    return (
        <Fragment>
            {[
                "practiceTests",
                "finalTests",
                "diagnosticTest",
                "customTets",
            ].includes(type) && (
                <MtUiButton
                    animated
                    className="py-3 px-8 border-primary text-primary"
                    block
                    onClick={setOpenConfirm}
                >
                    Submit
                </MtUiButton>
            )}
            <MtUiButton
                animated
                block
                onClick={handleFinish}
                disabled={isDisabled}
                type="primary"
                className="py-3 px-8"
            >
                {isFinish ? "Finish" : "Continue"}
            </MtUiButton>
        </Fragment>
    );
};

export default React.memo(WrapperBtnActions);
