"use client";
import React from "react";
import RadarChart from "./chart/radarChart";
import ListTopicResult from "./listTopicResult";

const ChartContentResultPage = () => {
    return (
        <div className="w-full flex gap-10 justify-between  mt-9">
            <RadarChart />
            <ListTopicResult />
        </div>
    );
};

export default ChartContentResultPage;
