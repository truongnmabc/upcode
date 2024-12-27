"use client";
import React, { Fragment, useEffect } from "react";
import { AntTab, AntTabs, CustomTabPanel } from "./tabsReviewAnswer";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";
import FilterIcon from "./filterAnswers";
// import QuestionResult from "./questionResult";
import { ITopicEndTest } from "../chartContent";
import { ICurrentGame } from "@/models/game/game";
import dynamic from "next/dynamic";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const QuestionResult = dynamic(() => import("./questionResult"), {
    ssr: false,
});
const ReviewAnswerResult = () => {
    const { listQuestion } = useAppSelector(gameState);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [listTopic, setListTopic] = React.useState<{
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }>({
        all: [],
        correct: [],
        incorrect: [],
    });

    useEffect(() => {
        if (listQuestion.length) {
            setListTopic({
                all: listQuestion,
                incorrect: listQuestion.filter(
                    (item) => !item.selectedAnswer?.correct
                ),
                correct: listQuestion.filter(
                    (item) => item.selectedAnswer?.correct
                ),
            });
        }
    }, [listQuestion]);

    return (
        <Fragment>
            <p className="text-2xl font-semibold">Review your answers</p>
            <div className="my-4 w-full">
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
                    <FilterIcon />
                </div>
                <MathJaxContext>
                    {/* <CustomTabPanel value={value} index={0}> */}
                    {listTopic.all.map((item, index) => (
                        <QuestionResult key={index} item={item} />
                    ))}
                    {/* </CustomTabPanel> */}
                    {/* <CustomTabPanel value={value} index={1}>
                    {listTopic.correct.map((item, index) => (
                        <QuestionResult key={index} item={item} />
                    ))}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    {listTopic.incorrect.map((item, index) => (
                        <QuestionResult key={index} item={item} />
                    ))}
                </CustomTabPanel> */}
                </MathJaxContext>
            </div>
        </Fragment>
    );
};

export default ReviewAnswerResult;
