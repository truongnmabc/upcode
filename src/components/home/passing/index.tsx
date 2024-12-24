"use client";
import PassingProbability from "@/components/passing/passingProbability";
import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

const PassingHome = () => {
    const isMobile = useIsMobile();
    if (isMobile) return <PassingProbability />;

    return <></>;
};

export default PassingHome;
