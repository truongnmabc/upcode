"use client";
import MtUiSkeleton from "@/components/loading-skeleton";
import { IAnswer } from "@/models/question/questions";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { MathJax } from "better-react-mathjax";
import React from "react";
import GetIconPrefix from "../choicesPanel/getIcon";
import choiceAnswer from "@/redux/repository/game/choiseAnswer/choiceAnswer";
import BtnTets from "@/tests/btn";
const AnswerButton = ({
    choice,
    index,
    isActions,
}: {
    choice: IAnswer;
    index: number;
    isActions?: boolean;
}) => {
    const dispatch = useAppDispatch();
    const { currentGame } = useAppSelector(gameState);

    const statusChoice =
        currentGame?.selectedAnswer &&
        ((currentGame?.selectedAnswer?.id === choice?.id && choice?.correct) ||
            choice.correct)
            ? "pass"
            : currentGame?.selectedAnswer?.id === choice?.id && !choice?.correct
            ? "miss"
            : "other";

    return (
        <div
            onClick={() => {
                if (
                    currentGame?.selectedAnswer === null ||
                    !currentGame?.selectedAnswer ||
                    isActions
                ) {
                    dispatch(
                        choiceAnswer({
                            question: currentGame,
                            choice: choice,
                        })
                    );
                }
            }}
            className={ctx(
                "flex gap-2 w-full h-full bg-white sm:bg-transparent items-center rounded-md border border-solid px-4 py-3 hover:bg-[#2121210a]",
                {
                    "border-[#21212185]":
                        isActions &&
                        currentGame?.selectedAnswer?.id === choice?.id,
                    "border-[#07C58C]": statusChoice === "pass" && !isActions,
                    "border-[#FF746D]": statusChoice === "miss" && !isActions,
                    "cursor-not-allowed ": currentGame?.selectedAnswer !== null,
                    "cursor-pointer ":
                        currentGame?.selectedAnswer === null ||
                        !currentGame?.selectedAnswer,
                }
            )}
            id={(index + 1).toString()}
        >
            <GetIconPrefix
                isActions={isActions}
                isSelect={currentGame?.selectedAnswer?.id === choice?.id}
                statusChoice={statusChoice}
            />

            {!choice.text ? (
                <MtUiSkeleton className="min-h-8 h-8 w-full" />
            ) : (
                <MathJax
                    style={{
                        fontSize: 12,
                    }}
                    dynamic
                    renderMode="post"
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: choice.text,
                        }}
                    />
                </MathJax>
            )}
            <BtnTets correct={choice.correct} />
        </div>
    );
};
export default React.memo(AnswerButton);
