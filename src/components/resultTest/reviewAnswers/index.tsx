"use client";
import { ICurrentGame } from "@/models/game/game";
import { MathJaxContext } from "better-react-mathjax";
import React, { Fragment } from "react";
import FilterIcon from "./filterAnswers";
import { AntTab, AntTabs, CustomTabPanel } from "./tabsReviewAnswer";
import { ITopicEndTest } from "..";

type IProps = {
    all: ICurrentGame[];
    correct: ICurrentGame[];
    incorrect: ICurrentGame[];

    result: {
        listTopic: ITopicEndTest[];
        pass: number;
        percent: number;
        isPass: boolean;
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    };
    setTabletData: (e: {
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }) => void;
};

const ReviewAnswerResult: React.FC<IProps> = ({
    all,
    correct,
    incorrect,
    setTabletData,
    result,
}) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            <p className="text-2xl mt-6 font-semibold">Review your answers</p>
            <div className="my-4 h-full w-full">
                <div className="flex pb-4 justify-between items-center gap-4 w-full">
                    <AntTabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <AntTab
                            label={<Label title="All" count={all.length} />}
                        />
                        <AntTab
                            label={
                                <Label title="Correct" count={correct.length} />
                            }
                        />
                        <AntTab
                            label={
                                <Label
                                    title="Incorrect"
                                    count={incorrect.length}
                                />
                            }
                        />
                    </AntTabs>
                    <FilterIcon setTabletData={setTabletData} result={result} />
                </div>
                {all?.length > 0 && (
                    <div className="w-full h-full min-h-screen">
                        <MathJaxContext>
                            <CustomTabPanel
                                value={value}
                                index={0}
                                data={all}
                            />
                            <CustomTabPanel
                                value={value}
                                index={1}
                                data={correct}
                            />
                            <CustomTabPanel
                                value={value}
                                index={2}
                                data={incorrect}
                            />
                        </MathJaxContext>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default ReviewAnswerResult;

const Label = ({ title, count }: { title: string; count: number }) => {
    return (
        <span className="flex items-center gap-1">
            {title}{" "}
            <span className="text-[8px] w-6 h-6 flex items-center justify-center text-[#7C6F5B] p-1 rounded-full bg-[#7C6F5B14]">
                {count}
            </span>
        </span>
    );
};
