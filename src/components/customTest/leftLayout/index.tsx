"use client";
import React from "react";
import GridLeftCustomTest from "../gridLeft";
import AnswerSheet from "@/components/study/questionGroup/answer/answerSheet";
import { useIsMobile } from "@/hooks/useIsMobile";
const LeftLayout = () => {
    const isMobile = useIsMobile();
    return (
        <div className="  h-full flex-col gap-4 flex w-full">
            {!isMobile && <AnswerSheet />}
            <GridLeftCustomTest />
        </div>
    );
};

export default LeftLayout;
