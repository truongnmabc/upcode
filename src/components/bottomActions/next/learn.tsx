"use client";
import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishQuestionThunk from "@/redux/repository/game/finish/finishQuestion";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion/nextQuestion";
import { revertPathName } from "@/utils/pathName";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const BtnNextQuestion = () => {
    const [isFinish, setIsFinish] = useState(false);
    const {
        currentGame,
        subTopicProgressId,
        idTopic,
        listQuestion,
        type,
        indexCurrentQuestion,
    } = useAppSelector(gameState);

    const params = useParams();

    const { appInfo } = useAppSelector(appInfoState);
    useEffect(() => {
        const isFinal = listQuestion.every(
            (item) => item.localStatus === "correct"
        );

        setIsFinish(isFinal);
    }, [listQuestion]);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleFinish = () => {
        if (isFinish) {
            dispatch(
                finishQuestionThunk({
                    subTopicProgressId: subTopicProgressId,
                    topicId: idTopic,
                })
            );

            const _href = revertPathName({
                href: `/finish?subTopicProgressId=${subTopicProgressId}&topic=${params?.slug}&partId=${idTopic}`,
                appName: appInfo.appShortName,
            });

            router.replace(_href, {
                scroll: true,
            });

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
            disabled={!currentGame?.selectedAnswer}
            type="primary"
            className="py-3 px-8"
        >
            {isFinish ? "Finish" : "Continue"}
        </MtUiButton>
    );
};
export default React.memo(BtnNextQuestion);
