"use client";
import PassingProbability from "@/components/passing";
import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

const PassingHome = () => {
    const isMobile = useIsMobile();
    if (isMobile) return <PassingProbability />;
    return null;
};

export default PassingHome;
