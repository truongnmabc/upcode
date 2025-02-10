"use client";
import { ITopicEndTest } from "@/app/[appShortName]/[state]/result_test/_components";
import TabPanelReview from "@/app/[appShortName]/[state]/result_test/_components/tabPanelReview";
import { AntTab, AntTabs } from "@/components/tabs";
import { ICurrentGame } from "@/models/game/game";
import React, { Fragment } from "react";
import Empty from "../empty";
import FilterIcon from "./filterAnswers";

type IProps = {
    all: ICurrentGame[];
    correct: ICurrentGame[];
    incorrect: ICurrentGame[];
    showFilter?: boolean;
    listTopic: ITopicEndTest[];
    setTabletData?: (e: {
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }) => void;
    title?: string;
    type?: "default" | "custom";
};

const ReviewAnswerResult: React.FC<IProps> = ({
    all,
    correct,
    incorrect,
    setTabletData,
    listTopic,
    showFilter = true,
    title,
    type,
}) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            {title && <p className="text-2xl mt-6 font-semibold">{title}</p>}
            <div className="flex pb-2 justify-between items-center gap-4 w-full">
                <AntTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <AntTab
                        label={
                            <LabelReviewAnswerResult
                                title="All"
                                count={all.length}
                            />
                        }
                    />
                    <AntTab
                        label={
                            <LabelReviewAnswerResult
                                title="Correct"
                                count={correct.length}
                            />
                        }
                    />
                    <AntTab
                        label={
                            <LabelReviewAnswerResult
                                title="Incorrect"
                                count={incorrect.length}
                            />
                        }
                    />
                </AntTabs>
                {showFilter && (
                    <FilterIcon
                        setTabletData={setTabletData}
                        listTopic={listTopic}
                        all={all}
                        correctIds={correct.map((i) => i.id)}
                    />
                )}
            </div>
            {all?.length > 0 ? (
                <div className="w-full flex-1 h-full transition-all">
                    <TabPanelReview
                        value={value}
                        index={0}
                        data={all}
                        type={type}
                    />
                    <TabPanelReview
                        value={value}
                        index={1}
                        data={correct}
                        type={type}
                    />
                    <TabPanelReview
                        value={value}
                        index={2}
                        type={type}
                        data={incorrect}
                    />
                </div>
            ) : (
                <Empty />
            )}
        </Fragment>
    );
};

export default ReviewAnswerResult;

const LabelReviewAnswerResult = ({
    title,
    count,
}: {
    title: string;
    count: number;
}) => {
    return (
        <span className="flex items-center gap-1">
            {title}{" "}
            <span className="text-[8px] w-6 h-6 flex items-center justify-center text-[#7C6F5B] p-1 rounded-full bg-[#7C6F5B14]">
                {count}
            </span>
        </span>
    );
};
