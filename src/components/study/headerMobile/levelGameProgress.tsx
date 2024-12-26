"use client";

import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import React from "react";
type IProps = {
    isActions?: boolean;
};
const LevelGameProgress: React.FC<IProps> = ({ isActions = false }) => {
    const { listQuestion, currentGame, type } = useAppSelector(gameState);

    return (
        <div className="flex bg-[#21212133] w-full h-1">
            {listQuestion.map((q, index) => (
                <div
                    key={index}
                    className={ctx("h-full w-full", {
                        "border-red-500": q.localStatus === "skip",
                        "border-[#5497FF] pointer-events-auto cursor-pointer":
                            currentGame?.id === q.id,
                        "border-[#07C58C] text-white bg-[#07C58C]":
                            q.localStatus === "correct" && !isActions,
                        "border-[#FF746D] text-white bg-[#FF746D]":
                            q.localStatus === "incorrect" && !isActions,
                        "opacity-90": q.localStatus === "new",
                        "cursor-pointer": isActions,
                        "cursor-not-allowed":
                            type === "test" &&
                            q.localStatus === "new" &&
                            !isActions,
                        "border-[#5497FF] text-white bg-[#5497FF]":
                            isActions && q.localStatus !== "new",
                    })}
                ></div>
            ))}
        </div>
    );
};
export default React.memo(LevelGameProgress);
