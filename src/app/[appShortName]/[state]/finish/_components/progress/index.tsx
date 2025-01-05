import React, { useEffect } from "react";
import "./styles.css";
import { IAnswer } from "@/models/question/questions";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
const labels = ["correct", "incorrect"];
const backgroundColors = ["#12E1AF", "#F9586B"];

const ProgressFinishPage = ({ listAnswer }: { listAnswer: IAnswer[] }) => {
    const [status, setStatus] = React.useState({
        success: 0,
        total: 0,
        dataValues: [0, 0],
    });

    useEffect(() => {
        if (listAnswer.length > 0) {
            const success = listAnswer?.filter((item) => item.correct).length;
            const total = listAnswer.length;
            const sortedAnswers = listAnswer.reduce(
                (acc, item) => {
                    if (item.correct) acc.correct++;
                    else acc.incorrect++;
                    return acc;
                },
                { correct: 0, incorrect: 0 }
            );

            setStatus({
                success: success,
                total: total,
                dataValues: [sortedAnswers.correct, sortedAnswers.incorrect],
            });
        }
    }, [listAnswer]);

    const data = {
        labels,
        datasets: [
            {
                label: "Questions",
                data: status.dataValues,
                backgroundColor: backgroundColors,
                borderWidth: 4,
                borderColor: "transparent",
                cutout: "78%",
                borderRadius: 16,
                spacing: 1,
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
    };

    return (
        <div className="w-full h-full flex items-center flex-col justify-center">
            <div className="w-[160px] relative h-[160px]">
                <svg
                    width="160px"
                    height="160px"
                    viewBox="0 0 160 160"
                    className="circular-progress"
                >
                    <circle className="bg"></circle>
                </svg>
                <Doughnut
                    width={160}
                    height={160}
                    data={data}
                    options={options}
                    className="z-10 absolute"
                />
                <div className="absolute z-0 bottom-0 right-0 top-0 left-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-[#7C6F5B] text-2xl font-semibold">
                            {status.success}/{status.total}
                        </p>
                        <p className="text-base font-normal text-[#7C6F5B]">
                            questions
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-sm sm:text-base pt-6 text-center sm:pt-8 font-normal">
                You correctly answered{" "}
                <span className="text-base font-semibold">
                    {status.success}/{status.total}
                </span>{" "}
                questions on the first turn.
            </div>
        </div>
    );
};

export default React.memo(ProgressFinishPage);
