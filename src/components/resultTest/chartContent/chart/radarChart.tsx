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
import { ITopicEndTest } from "..";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);
type IProps = {
    listTopic: ITopicEndTest[];
};
const RadarChart: React.FC<IProps> = ({ listTopic }) => {
    const data = {
        labels: listTopic.map((item) => item.name?.slice(0, 5)),
        datasets: [
            {
                label: "My First Dataset",
                data: listTopic.map((item) => item.incorrect),
                fill: true,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgb(255, 99, 132)",
                pointBackgroundColor: "rgb(255, 99, 132)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(255, 99, 132)",
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hiển thị chú thích (legend)
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
                suggestedMax: 3, // Giá trị tối đa
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
