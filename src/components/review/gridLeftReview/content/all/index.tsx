import {
    AntTab,
    AntTabs,
    CustomTabPanel,
} from "@/components/resultTest/reviewAnswers/tabsReviewAnswer";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import React, { useEffect } from "react";
import { MathJaxContext } from "better-react-mathjax";

const AllQuestions = () => {
    const [listTopic, setListTopic] = React.useState<{
        all: IUserQuestionProgress[];
        correct: IUserQuestionProgress[];
        incorrect: IUserQuestionProgress[];
    }>({
        all: [],
        correct: [],
        incorrect: [],
    });
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    useEffect(() => {
        const handleGetData = async () => {
            const data = await db?.userProgress.toArray();
            if (data) {
                setListTopic({
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
        <div>
            <p className="text-2xl text-center font-semibold">
                Review your answers
            </p>
            <div className="my-4 h-full w-full">
                <div className="flex pb-4 justify-between items-center gap-4 w-full">
                    <AntTabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <AntTab label="All" />
                        <AntTab label="Correct" />
                        <AntTab label="Incorrect" />
                    </AntTabs>
                </div>
                <div className="w-full h-full min-h-screen">
                    <MathJaxContext>
                        <CustomTabPanel
                            value={value}
                            index={0}
                            data={listTopic.all}
                        />
                        <CustomTabPanel
                            value={value}
                            index={1}
                            data={listTopic.correct}
                        />
                        <CustomTabPanel
                            value={value}
                            index={2}
                            data={listTopic.incorrect}
                        />
                    </MathJaxContext>
                </div>
            </div>
        </div>
    );
};

export default AllQuestions;
