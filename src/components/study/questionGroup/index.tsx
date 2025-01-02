"use client";
import React from "react";
import AnswerSheet from "./answer/answerSheet";
import FinalTestBtn from "./finalTestBtn/finalTestBtn";
import GridTestsLeft from "./gridTests/gridTestsLeft";
import GridTopicLeft from "./gridTopics/gridTopicLeft";
import { useSearchParams } from "next/navigation";

const QuestionGroup = () => {
    const type = useSearchParams().get("type");
    return (
        <div className="hidden sm:block w-full">
            <div className="flex p-3 bg-white rounded-xl flex-col gap-4">
                {type === "test" && <AnswerSheet />}
                {type === "test" ? (
                    <>
                        <GridTestsLeft />
                        <div className="w-full h-[1px] bg-[#21212129]"></div>
                        <GridTopicLeft />
                    </>
                ) : (
                    <>
                        <GridTopicLeft />
                        <div className="w-full h-[1px] bg-[#21212129]"></div>
                        <GridTestsLeft />
                    </>
                )}
                <div className="w-full h-[1px] bg-[#21212129]"></div>
                <FinalTestBtn />
            </div>
        </div>
    );
};
export default React.memo(QuestionGroup);
