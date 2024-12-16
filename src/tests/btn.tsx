"use client";
import Config from "@/common/config";
import { getSession } from "@/utils/session";
import React from "react";

const BtnTets = ({ correct }: { correct: boolean }) => {
    const isTest = getSession(Config.TESTER_KEY);

    if (isTest && correct)
        return (
            <div>
                <span>★</span>
            </div>
        );
    return <></>;
};

export default BtnTets;
