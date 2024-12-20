"use client";

import { RANDOM_COLORS } from "@/common/constants";
import AllowExpand from "@/components/home/gridTopic/allowExpand";
import AllowExpandProvider from "@/components/home/gridTopic/allowExpand/provider";
import TitleTopic from "@/components/home/gridTopic/item/titleTopic";
import { db } from "@/db/db.model";
import Topic, { ITopic } from "@/models/topics/topics";
import { appInfoState } from "@/redux/features/appInfo";
import { studyState } from "@/redux/features/study";
import { useAppSelector } from "@/redux/hooks";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import React, { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
export const generateMockTopics = (size: number): ITopic[] => {
    return Array.from({ length: size }, (_, index) => {
        const initData = new Topic({
            id: index,
        });
        return {
            ...initData,
            color: RANDOM_COLORS[index],
        };
    });
};
export const mockData: ITopic[] = generateMockTopics(10);

const FN = () => {
    const { appInfo } = useAppSelector(appInfoState);
    const { selectedTopics } = useAppSelector(studyState);
    const [listMainTopics, setListMainTopics] = useState<ITopic[]>(mockData);
    const type = useSearchParams().get("type");

    const [open, setOpen] = React.useState(type === "learn");

    const handleClick = () => setOpen(!open);

    const handleGetData = async () => {
        const listData = await db?.topics.toArray();
        if (listData) {
            setListMainTopics(
                listData
                    .map((item, index) => ({
                        ...item,
                        id: Number(item.id),
                        color: RANDOM_COLORS[index],
                    }))
                    .sort((a, b) => {
                        if (a.id === selectedTopics) return -1;
                        if (b.id === selectedTopics) return 1;
                        return 0;
                    })
            );
        }
    };

    useEffect(() => {
        handleGetData();
    }, []);

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
                                imgClassNames="w-[52px] h-[52px]"
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
