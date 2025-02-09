import ReviewAnswerResult from "@/components/reviewAnswers";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

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
    const handleGetData = useCallback(async () => {
        const progress = await db?.userProgress.toArray();

        const listIds = progress?.map((item) => item?.id) || [];
        if (!progress || progress.length === 0) return;
        const data = await db?.questions.where("id").anyOf(listIds).toArray();

        if (!data) return;
        const questionMap = new Map(
            progress.map((p) => [p.id, p.selectedAnswers])
        );

        const allQuestions = data.map((question) => ({
            ...question,
            selectedAnswers: questionMap.get(question.id) || [],
        }));

        const correctQuestions: ICurrentGame[] = [];
        const incorrectQuestions: ICurrentGame[] = [];

        allQuestions.forEach((question) => {
            const selectedAnswers = question.selectedAnswers || [];
            const hasIncorrect = selectedAnswers.some(
                (answer) => !answer.correct
            );

            if (hasIncorrect) {
                incorrectQuestions.push(question);
            } else {
                correctQuestions.push(question);
            }
        });

        setTabletData({
            all: allQuestions,
            correct: correctQuestions,
            incorrect: incorrectQuestions,
        });
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div
            className={clsx("w-full flex-1 flex flex-col transition-all ", {})}
        >
            <ReviewAnswerResult
                all={tableData.all}
                correct={tableData.correct}
                incorrect={tableData.incorrect}
                showFilter={false}
                listTopic={[]}
                title=""
            />
        </div>
    );
};

export default AllQuestions;
