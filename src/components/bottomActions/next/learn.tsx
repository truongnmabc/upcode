"use client";
import { MtUiButton } from "@/components/button";
import {
    selectCurrentGame,
    selectIndexCurrentQuestion,
    selectIsEndTimeTest,
    selectListQuestion,
    selectSubTopicProgressId,
    selectType,
} from "@/redux/features/game.reselect";
import { selectTopicsId } from "@/redux/features/study.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishQuestionThunk from "@/redux/repository/game/finish/finishQuestion";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion/nextQuestion";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const BtnNextQuestion = () => {
    const [isFinish, setIsFinish] = useState(false);

    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const currentGame = useAppSelector(selectCurrentGame);
    const subTopicProgressId = useAppSelector(selectSubTopicProgressId);
    const idTopic = useAppSelector(selectTopicsId);
    const listQuestion = useAppSelector(selectListQuestion);
    const type = useAppSelector(selectType);
    const indexCurrentQuestion = useAppSelector(selectIndexCurrentQuestion);
    const isEndTimeTest = useAppSelector(selectIsEndTimeTest);

    useEffect(() => {
        const isFinal = listQuestion.every(
            (item) => item.localStatus === "correct"
        );

        setIsFinish(isFinal);
    }, [listQuestion]);

    const handleFinish = () => {
        if (isFinish) {
            dispatch(
                finishQuestionThunk({
                    subTopicProgressId: subTopicProgressId,
                    topicId: idTopic,
                })
            );

            router.replace(
                `/finish?subTopicProgressId=${subTopicProgressId}&topic=${params?.["slug"]}&partId=${idTopic}`,
                {
                    scroll: true,
                }
            );

            return;
        }
        dispatch(nextQuestionThunk());
    };

    if (indexCurrentQuestion + 1 === listQuestion?.length && type === "test") {
        return null;
    }
    return (
        <MtUiButton
            animated
            block
            onClick={handleFinish}
            disabled={
                !currentGame?.selectedAnswer ||
                (type === "test" && isEndTimeTest)
            }
            type="primary"
            className="py-3 px-8"
        >
            {isFinish ? "Finish" : "Continue"}
        </MtUiButton>
    );
};
export default React.memo(BtnNextQuestion);
