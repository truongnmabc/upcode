import { ICurrentGame } from "@/models/game/game";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import React, { useContext, useEffect, useState } from "react";
import { ReviewContext } from "../../context/reviewContext";

const AnswerReview = ({ isActions = false }) => {
    const { listQuestion, currentGame, type } = useAppSelector(gameState);
    const { selectType } = useContext(ReviewContext);

    const dispatch = useAppDispatch();

    if (selectType && listQuestion.length > 0) {
        return (
            <div className="bg-white flex flex-col gap-3 dark:bg-black p-4 rounded-md">
                <h3 className="font-semibold text-center text-xl truncate font-poppins">
                    Questions
                </h3>
                <div className="flex gap-2  flex-wrap ">
                    {listQuestion?.map((q, index) => {
                        return (
                            <div
                                key={index}
                                className={ctx(
                                    "w-[30px] h-[30px]  text-xs rounded transition-all flex items-center justify-center border border-solid",
                                    {
                                        "border-red-500":
                                            q.localStatus === "skip",
                                        "border-[#5497FF] pointer-events-auto cursor-pointer":
                                            currentGame?.id === q.id,
                                        "border-[#07C58C] text-white bg-[#07C58C]":
                                            q.localStatus === "correct" &&
                                            !isActions,
                                        "border-[#FF746D] text-white bg-[#FF746D]":
                                            q.localStatus === "incorrect" &&
                                            !isActions,
                                        "opacity-90": q.localStatus === "new",
                                        "cursor-pointer": isActions,
                                        "cursor-not-allowed":
                                            type === "test" &&
                                            q.localStatus === "new" &&
                                            !isActions,
                                        "border-[#5497FF] text-white bg-[#5497FF]":
                                            isActions &&
                                            q.localStatus !== "new",
                                    }
                                )}
                                // onClick={() => {
                                //     if (isActions && currentGame?.id !== q.id)
                                //         dispatch(viewTest(index));
                                // }}
                            >
                                {index + 1}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return <></>;
};

export default AnswerReview;
