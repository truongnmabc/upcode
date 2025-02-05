"use client";
import { calculatePassingApp } from "@/app/[appShortName]/[state]/finish/_components/calculate";
import React, { useEffect, useState } from "react";
import "./passing.css";

const PassingProbability = () => {
    const [passingValue, setPassingValue] = useState(0);

    useEffect(() => {
        const handleGetData = async () => {
            try {
                const passing = await calculatePassingApp();

                if (passing) {
                    const passingRounded = Math.round(passing * 10) / 10;

                    setPassingValue(passingRounded);
                } else {
                    setPassingValue(0);
                }
            } catch (error) {
                console.error("Error in handleGetData:", error);
                setPassingValue(0);
            }
        };
        handleGetData();
    }, []);
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
                <div className="progress-label ">{passingValue}%</div>
            </div>
        </div>
    );
};

export default React.memo(PassingProbability);
