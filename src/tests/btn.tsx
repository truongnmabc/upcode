"use client";
import { TESTER_KEY } from "@/constants";
import { getSession } from "@/utils/session";
import React from "react";

const BtnTets = ({ correct }: { correct: boolean }) => {
    const isTest = getSession(TESTER_KEY);

    if (isTest && correct)
        return (
            <div>
                <span>★</span>
            </div>
        );
    return null;
};
export default BtnTets;
