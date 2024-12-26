"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
const DashboardCard = ({
    info,
}: {
    info: {
        total: number;
        pass: number;
        percent: number;
    };
}) => {
    const handleClickImprove = () => {
        console.log("handleClickImprove");
    };

    const data = {
        labels: ["correct", "incorrect"],
        datasets: [
            {
                data: [info.percent, 100 - info.percent],
                backgroundColor: ["#12E1AF", "transparent"],
                borderColor: "transparent",
                cutout: "90%",
                borderRadius: 16,
                spacing: 2,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        rotation: 270,
        circumference: 180,
        aspectRatio: 2,
    };
    return (
        <div className="relative min-w-[320px] h-[340px] z-0 flex flex-col items-center">
            <div className=" absolute top-0 z-10 w-full left-0">
                <svg className="w-[320px]  h-[320px]">
                    <circle
                        cx="160"
                        cy="160"
                        r="140"
                        stroke="#F87171"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray="440"
                        strokeDashoffset="440"
                        strokeLinecap="round"
                    ></circle>
                </svg>
                <div className="w-[320px]  h-[320px] z-10  absolute top-0 pt-[10px] left-0 flex justify-center">
                    <div className="w-[300px]   h-[160px]   ">
                        <Doughnut data={data} options={options} />
                    </div>
                </div>

                <div className="absolute z-10 inset-0 flex pt-[126px] justify-center">
                    <span className="text-5xl font-bold text-[#F87171]">
                        {info.percent} %
                    </span>
                </div>
            </div>

            <div className=" absolute  bottom-0 left-0 w-full z-20">
                <div className="mt-4 flex justify-between w-full ">
                    <div className="flex  gap-2">
                        <div className="h-1 mt-3 rounded-md bg-[#15CB9F] w-3"></div>
                        <div>
                            <p className="text-[#939393] text-lg font-normal">
                                Correct
                            </p>
                            <p className="text-[#0C1827] text-lg font-semibold">
                                {info.pass} questions
                            </p>
                        </div>
                    </div>
                    <div className="flex  gap-2">
                        <div className="h-1 mt-3 rounded-md bg-[#EF4444] w-3"></div>

                        <div>
                            <p className="text-[#939393] text-lg font-normal">
                                Incorrect
                            </p>
                            <p className="text-[#0C1827] text-lg font-semibold">
                                {info.total} questions
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 w-full bg-[#F2EADB] z-10 overflow-hidden relative rounded-xl p-3 flex flex-col gap-2 items-center">
                    <div className="w-full flex items-center z-10 justify-between">
                        <p className="text-sm font-medium ">
                            Passing Probability
                        </p>
                        <div
                            className="ml-4  text-white text-sm px-3 cursor-pointer py-1 rounded-full shadow-md "
                            style={{
                                background:
                                    "linear-gradient(90deg, #E3C151 0%, #E3A651 50.09%, #F39153 100%)",
                            }}
                            onClick={handleClickImprove}
                        >
                            Improve
                        </div>
                    </div>

                    <div className="relative w-full h-5 mt-1 z-10 bg-white rounded-full">
                        <div
                            className="absolute w-1/2 top-0 left-0 h-5 bg-yellow-500 rounded-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #E3C151 0%, #E3A651 50%, #F39153 100%)",
                            }}
                        ></div>
                    </div>
                    <div className="absolute inset-0 pt-2 z-0">
                        <Pattern />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;

export const Pattern = () => {
    return (
        <svg
            width="295"
            height="73"
            viewBox="0 0 295 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M228.605 91.0281C228.605 140.711 177.703 181.209 114.603 181.209C51.5029 181.209 0.6 140.711 0.6 91.0281C0.6 41.3455 51.5029 0.847314 114.603 0.847314C177.703 0.847314 228.605 41.3455 228.605 91.0281Z"
                stroke="white"
                strokeOpacity="0.32"
                strokeWidth="1.2"
            />
            <path
                d="M294.277 98.7541C294.277 123.225 280.506 145.434 258.131 161.548C235.758 177.662 204.819 187.647 170.617 187.647C136.415 187.647 105.476 177.662 83.1021 161.548C60.7275 145.434 46.9564 123.225 46.9564 98.7541C46.9564 74.2831 60.7275 52.0741 83.1021 35.9598C105.476 19.8461 136.415 9.86099 170.617 9.86099C204.819 9.86099 235.758 19.8461 258.131 35.9598C280.506 52.0741 294.277 74.2831 294.277 98.7541Z"
                stroke="white"
                strokeOpacity="0.32"
                strokeWidth="1.2"
            />
        </svg>
    );
};
