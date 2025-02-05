"use client";
import React from "react";
import GridLeftCustomTest from "../gridLeft";
import { useIsMobile } from "@/hooks/useIsMobile";
import dynamic from "next/dynamic";
const AnswerSheet = dynamic(() => import("@/components/listLeftQuestions"), {
    ssr: false,
});

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
