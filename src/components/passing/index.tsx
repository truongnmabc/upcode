"use client";
import {
    totalPassingApp,
    totalQuestionApp,
} from "@/app/[appShortName]/[state]/finish/_components/calculate";
import { db } from "@/db/db.model";
import React, { useCallback, useEffect, useState } from "react";
import "./passing.css";

const PassingProbability = () => {
    const [passingValue, setPassingValue] = useState(0);

    const handleGetData = useCallback(async () => {
        const data = await db?.passing.toArray();
        if (data?.length) {
            const passing = totalPassingApp(data);
            const total = totalQuestionApp(data);
            setPassingValue(passing / total);
        }
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);
    return (
        <div className="p-4 rounded-md bg-[#2121210A] dark:bg-black">
            <h3 className="font-semibold truncate text-lg">
                Passing Probability
            </h3>
            <div className="mt-3 h-12 w-full custom-progress relative">
                <progress
                    value={passingValue}
                    max={100}
                    className="w-full"
                ></progress>
                <div className="progress-label ">
                    {passingValue.toFixed(4)}%
                </div>
            </div>
        </div>
    );
};

export default React.memo(PassingProbability);
