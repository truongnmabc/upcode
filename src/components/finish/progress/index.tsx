import React from "react";
import "./styles.css";
import { IAnswer } from "@/models/question/questions";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const groupAnswers = (listAnswer: { correct: boolean }[]) => {
    const result = [];
    let currentCount = 1;

    for (let i = 1; i < listAnswer.length; i++) {
        // Kiểm tra nếu câu hiện tại có trạng thái giống câu trước
        if (listAnswer[i].correct === listAnswer[i - 1].correct) {
            currentCount++; // Nếu giống thì tăng số lượng
        } else {
            // Nếu khác, push nhóm cũ vào kết quả và bắt đầu nhóm mới
            result.push({
                label: listAnswer[i - 1].correct ? "correct" : "incorrect",
                count: currentCount,
            });
            currentCount = 1;
        }
    }

    result.push({
        label: listAnswer[listAnswer.length - 1]?.correct
            ? "correct"
            : "incorrect",
        count: currentCount,
    });

    return result;
};

const ProgressFinishPage = ({ listAnswer }: { listAnswer: IAnswer[] }) => {
    const success = listAnswer?.filter((item) => item.correct).length;
    const total = listAnswer.length;
    const groupedAnswers = groupAnswers(listAnswer || []);

    const data = {
        labels: groupedAnswers.map((item) => item.label),
        datasets: [
            {
                label: "Questions",
                data: groupedAnswers.map((item) => item.count),
                backgroundColor: groupedAnswers.map((item) =>
                    item.label === "correct" ? "#12E1AF" : "#F9586B"
                ),
                borderWidth: 4,
                borderColor: "transparent",
                cutout: "78%",
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
                            {success}/{total}
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
                    {success}/{total}
                </span>{" "}
                questions on the first turn.
            </div>
        </div>
    );
};

export default ProgressFinishPage;
