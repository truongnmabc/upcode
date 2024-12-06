"use client";
import { gameState, ICurrentGame } from "@/lib/redux/features/game";
import { useAppSelector } from "@/lib/redux/hooks";
import ctx from "@/utils/mergeClass";
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
        localStatus: "lock",
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

const AnswerSheet = () => {
    const { listQuestion, indexCurrentQuestion } = useAppSelector(gameState);
    const [list, setList] = useState<ICurrentGame[]>(defaultData);
    useEffect(() => {
        if (listQuestion && listQuestion.length > 0) {
            setList(listQuestion);
        }
    }, [listQuestion]);

    return (
        <div className="bg-white flex flex-col gap-3 dark:bg-black p-4 rounded-md">
            <h3 className="font-semibold text-xl truncate font-poppins">
                Your Progress
            </h3>
            <div className="flex gap-2 flex-wrap ">
                {list?.map((q, index) => {
                    return (
                        <div
                            key={index}
                            className={ctx(
                                "w-[30px] h-[30px] text-xs cursor-not-allowed  rounded transition-all flex items-center justify-center border border-solid",
                                {
                                    "border-[#5497FF] pointer-events-auto cursor-pointer":
                                        indexCurrentQuestion === index ||
                                        q.localStatus === "unlock",
                                    "border-[#07C58C] text-white bg-[#07C58C]":
                                        q.localStatus === "pass" &&
                                        indexCurrentQuestion !== index,
                                    "border-[#FF746D] text-white bg-[#FF746D]":
                                        q.localStatus === "miss" &&
                                        indexCurrentQuestion !== index,
                                    "opacity-90": q.localStatus === "lock",
                                }
                            )}
                            // onClick={(e) => {
                            //   dispatch(setCurrentQuestion(listQuestion[index]));
                            // }}
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
