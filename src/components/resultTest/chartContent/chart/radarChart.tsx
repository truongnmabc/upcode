"use client";
import React from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const RadarChart = () => {
    const data = {
        labels: [
            "Eating",
            "Drinking",
            "Sleeping",
            "Designing",
            "Coding",
            "Cycling",
            "Running",
        ],
        datasets: [
            {
                label: "My First Dataset",
                data: [65, 59, 90, 81, 56, 55, 40],
                fill: true,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgb(255, 99, 132)",
                pointBackgroundColor: "rgb(255, 99, 132)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(255, 99, 132)",
            },
            {
                label: "My Second Dataset",
                data: [28, 48, 40, 19, 96, 27, 100],
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgb(54, 162, 235)",
                pointBackgroundColor: "rgb(54, 162, 235)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(54, 162, 235)",
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true, // Hiển thị chú thích (legend)
                position: "top",
            },
            tooltip: {
                enabled: true, // Hiển thị tooltip
            },
        },
        scales: {
            r: {
                angleLines: {
                    display: true, // Hiển thị các đường góc
                },
                suggestedMin: 0, // Giá trị tối thiểu
                suggestedMax: 100, // Giá trị tối đa
            },
        },
    };
    return (
        <div className="w-[576px] flex items-center justify-center h-[460px]">
            <Radar data={data} options={options} />
        </div>
    );
};

export default RadarChart;
