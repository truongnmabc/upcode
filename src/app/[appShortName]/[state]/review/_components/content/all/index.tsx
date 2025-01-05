import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import React, { useEffect, useState } from "react";
import ReviewAnswerResult from "@/components/reviewAnswers";

const AllQuestions = () => {
    const [tableData, setTabletData] = useState<{
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }>({
        all: [],
        correct: [],
        incorrect: [],
    });

    useEffect(() => {
        const handleGetData = async () => {
            const data = await db?.userProgress.toArray();
            if (data) {
                setTabletData({
                    all: data,
                    incorrect: data.filter(
                        (item) => !item.selectedAnswer?.correct
                    ),
                    correct: data.filter(
                        (item) => item.selectedAnswer?.correct
                    ),
                });
            }
        };
        handleGetData();
    }, []);

    return (
        <ReviewAnswerResult
            all={tableData.all}
            correct={tableData.correct}
            incorrect={tableData.incorrect}
            showFilter={false}
            title=""
        />
    );
};

export default AllQuestions;
