"use client";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { Grid2 } from "@mui/material";
import React from "react";
import ItemGridTest from "./itemGridTest/ItemGridTest";
import CustomTestSvg from "./itemGridTest/icon/CustomTestSvg";
import DiagnosticTestSvg from "./itemGridTest/icon/DiagnosticTestSvg";
import FinalTestSvg from "./itemGridTest/icon/FinalTestSvg";
import PracticeTestsSvg from "./itemGridTest/icon/PracticeTestsSvg";

export const mockGirdTests = [
    {
        id: "DT",
        icon: <DiagnosticTestSvg />,
        name: "Diagnostic Test",
        color: "#309F8C",
    },
    {
        id: "PT",
        icon: <PracticeTestsSvg />,
        name: "Practice Tests",
        color: "#4797B1",
    },
    {
        id: "FT",
        icon: <FinalTestSvg />,
        color: "#639CDD",
        name: "Final Test",
    },
    {
        id: "CT",
        icon: <CustomTestSvg />,
        color: "#686EE2",
        name: "Custom Test",
    },
];
const GridTest = () => {
    const { appInfo } = useAppSelector(appInfoState);

    return (
        <div className="w-full flex flex-col gap-4 sm:gap-8">
            <h3 className="sm:text-4xl text-center text-xl font-semibold">
                Take Full {appInfo.appName} Practice Test
            </h3>
            <h4 className="text-xs sm:text-base  text-center">
                Ace your exam with our comprehensive practice tests! Get started
                with a Diagnostic Test to identify your strengths and
                weaknesses. Then, master the content with our Practice Tests.
                Finally, fine-tune your skills with the Final Test and Custom
                Test for ultimate confidence.
            </h4>
            <div className="w-full ">
                <Grid2 container spacing={2}>
                    {mockGirdTests.map((test) => (
                        <ItemGridTest key={test.id} item={test} />
                    ))}
                </Grid2>
            </div>
        </div>
    );
};

export default React.memo(GridTest);
