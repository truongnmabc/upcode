"use client";
import { ICurrentGame } from "@/models/game/game";
import { gameState, viewTest } from "@/redux/features/game";
import {
    selectCurrentGame,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const createTempData = (size: number): ICurrentGame[] => {
    return Array.from({ length: size }, (_, index) => ({
        id: index,
        parentId: index,
        explanation: "",
        text: "",
        hasChild: false,
        image: "",
        answers: [],
        localStatus: "new",
        selectedAnswer: null,
        appId: 0,
        hint: "",
        index,
        level: 0,
        status: 0,
        syncStatus: 0,
    }));
};

const defaultData: ICurrentGame[] = createTempData(10);

type IProps = {
    isActions?: boolean;
};
const AnswerSheet: React.FC<IProps> = ({ isActions = false }) => {
    const listQuestion = useAppSelector(selectListQuestion);
    const currentGame = useAppSelector(selectCurrentGame);
    const type = useSearchParams().get("type");
    const dispatch = useAppDispatch();

    const sortedListQuestion = [...listQuestion].sort((a, b) => {
        if (a.localStatus === "correct" && b.localStatus !== "correct")
            return -1;
        if (a.localStatus !== "correct" && b.localStatus === "correct")
            return 1;
        if (a.localStatus === "incorrect" && b.localStatus !== "incorrect")
            return -1;
        if (a.localStatus !== "incorrect" && b.localStatus === "incorrect")
            return 1;
        return 0;
    });

    return (
        <div className="bg-white flex flex-col gap-3 dark:bg-black p-4 rounded-md">
            <h3 className="font-semibold text-center text-xl truncate font-poppins">
                Questions
            </h3>
            <div className="flex gap-2  flex-wrap ">
                {sortedListQuestion?.map((q, index) => {
                    return (
                        <div
                            key={index}
                            className={ctx(
                                "w-[30px] h-[30px]  text-xs rounded transition-all flex items-center justify-center border border-solid",
                                {
                                    "border-red-500": q.localStatus === "skip",
                                    // "border-[#5497FF] pointer-events-auto cursor-pointer":
                                    //     currentGame?.id === q.id,
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
                                        isActions && q.localStatus !== "new",
                                }
                            )}
                            onClick={() => {
                                if (isActions && currentGame?.id !== q.id)
                                    dispatch(viewTest(index));
                            }}
                        >
                            {index + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(AnswerSheet);
