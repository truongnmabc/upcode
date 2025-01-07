"use client";
import React from "react";
import GridLeftCustomTest from "../gridLeft";
import { useIsMobile } from "@/hooks/useIsMobile";
import AnswerSheet from "@/components/listLeftQuestions";
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
