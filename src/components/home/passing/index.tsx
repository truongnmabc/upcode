"use client";
// import PassingProbability from "@/components/passing";
import { useIsMobile } from "@/hooks/useIsMobile";
import dynamic from "next/dynamic";
import React from "react";

const PassingProbability = dynamic(() => import("@/components/passing"), {
    ssr: false,
});
const PassingHome = () => {
    const isMobile = useIsMobile();
    if (isMobile) return <PassingProbability />;
    return null;
};

export default PassingHome;
