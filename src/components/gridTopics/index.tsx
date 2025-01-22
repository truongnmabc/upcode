"use client";

import AllowExpand from "@/components/allowExpand";
import AllowExpandProvider from "@/components/allowExpand/provider";
import TitleTopic from "@/components/home/gridTopic/item/titleTopic";
import { db } from "@/db/db.model";
import Topic, { ITopic } from "@/models/topics/topics";
import { useAppSelector } from "@/redux/hooks";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { selectTopicsId } from "@/redux/features/study.reselect";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";

export const generateMockTopics = (size: number): ITopic[] => {
    return Array.from({ length: size }, (_, index) => {
        const initData = new Topic({
            id: index,
        });
        return {
            ...initData,
        };
    });
};
export const mockData: ITopic[] = generateMockTopics(10);

const FN = () => {
    const appInfo = useAppSelector(selectAppInfo);
    const selectedTopics = useAppSelector(selectTopicsId);
    const [listMainTopics, setListMainTopics] = useState<ITopic[]>(mockData);
    const type = useSearchParams()?.get("type");

    const [open, setOpen] = React.useState(type === "learn");

    const handleClick = () => setOpen(!open);

    const handleGetData = useCallback(async () => {
        // if (selectedTopics !== -1) {
        const listData = await db?.topics.toArray();
        if (listData) {
            setListMainTopics(listData);
        }
        // }
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div className="w-full flex flex-col gap-4">
            <div
                className="flex justify-between items-center w-full"
                onClick={handleClick}
            >
                <h3 className="font-semibold text-xl font-poppins">
                    More {appInfo.appName} Topics
                </h3>
                {open ? <ExpandLess /> : <ExpandMore />}
            </div>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <div className="w-full flex flex-col gap-2">
                    {listMainTopics?.map((subTopic, index) => (
                        <Fragment key={index}>
                            <TitleTopic
                                topic={subTopic}
                                priority={3}
                                classNames=" h-[52px] "
                                imgClassNames="w-8 h-8 sm:w-10 sm:h-10"
                            />
                            {selectedTopics === subTopic.id && (
                                <AllowExpandProvider topic={subTopic}>
                                    <AllowExpand />
                                </AllowExpandProvider>
                            )}
                        </Fragment>
                    ))}
                </div>
            </Collapse>
        </div>
    );
};

const GridTopicLeft = React.memo(FN);

export default GridTopicLeft;
