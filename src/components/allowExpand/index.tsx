"use client";
import RouterApp from "@/common/router/router.constant";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ITopic } from "@/models/topics/topics";
import { studyState } from "@/redux/features/study";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { convertPathName } from "@/utils/pathName";
import { Collapse } from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { AllowExpandContext, IContextAllowExpand } from "./provider";
import TitleCollapse from "./titleCollapse";

const AllowExpand = () => {
    const pathname = usePathname();
    const { color, mainTopic } =
        useContext<IContextAllowExpand>(AllowExpandContext);
    const currentPathname = convertPathName(pathname);
    const { selectedTopics } = useAppSelector(studyState);
    const isAllowExpand = selectedTopics === mainTopic?.id;
    const isMobile = useIsMobile();

    const open =
        !isMobile && currentPathname === RouterApp.Home
            ? false
            : selectedTopics === mainTopic?.id;
    return (
        <Collapse timeout="auto" unmountOnExit in={open}>
            <div
                // style={{
                //     borderColor: isAllowExpand ? color : "transparent",
                // }}
                className={ctx("bg-white transition-all p-3", {
                    "border border-t-0 border-primary rounded-bl-md rounded-br-md border-solid":
                        isAllowExpand && currentPathname === RouterApp.Home,
                    " rounded-md": currentPathname !== RouterApp.Home,
                })}
            >
                <div className="flex gap-2 flex-col ">
                    {mainTopic?.topics &&
                        mainTopic?.topics?.length > 0 &&
                        mainTopic?.topics?.map((subTopic: ITopic, index) => (
                            <TitleCollapse subTopic={subTopic} key={index} />
                        ))}
                </div>
            </div>
        </Collapse>
    );
};

export default React.memo(AllowExpand);
