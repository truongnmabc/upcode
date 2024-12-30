import { ITopic } from "@/models/topics/topics";
import { selectSubTopics, studyState } from "@/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { ExpandMore } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import clsx from "clsx";
import React from "react";
import LazyLoadImage from "../images";
import TopicLevelProgress from "./topicLevelProgress";
const FN = ({ subTopic }: { subTopic: ITopic }) => {
    const { selectedSubTopics } = useAppSelector(studyState);
    const isExpand = selectedSubTopics === subTopic.id;
    const dispatch = useAppDispatch();

    return (
        <div className="w-full h-full">
            <div
                className={ctx(
                    "w-full bg-[#F3F5F6] p-3  cursor-pointer flex gap-2 items-center justify-between",
                    {
                        "rounded-t-md": isExpand,
                        "rounded-md": !isExpand,
                    }
                )}
                onClick={() => {
                    if (isExpand) {
                        dispatch(selectSubTopics(-1));
                    } else {
                        dispatch(selectSubTopics(subTopic.id));
                    }
                }}
            >
                <div className="flex flex-1 overflow-hidden gap-2 items-center">
                    <div className="p-1 w-fit h-fit bg-primary-16 flex items-center justify-center rounded-md">
                        <LazyLoadImage
                            src={subTopic.icon}
                            classNames="w-6 flex items-center justify-center h-6"
                            imgClassNames="w-5 h-5"
                            alt={subTopic.name}
                            styles={{
                                filter: "brightness(0) saturate(100%) invert(81%) sepia(50%) saturate(2746%) hue-rotate(336deg) brightness(100%) contrast(98%) ",
                            }}
                        />
                    </div>
                    <h4 className="text-xs flex-1 truncate overflow-hidden font-medium">
                        {subTopic.name}
                    </h4>
                </div>
                <div
                    className={clsx("transition-all", {
                        "rotate-180": isExpand,
                    })}
                >
                    <ExpandMore />{" "}
                </div>
            </div>
            <Collapse in={isExpand} unmountOnExit timeout="auto">
                <TopicLevelProgress subTopic={subTopic} />
            </Collapse>
        </div>
    );
};

const TitleCollapse = React.memo(FN);

export default TitleCollapse;
