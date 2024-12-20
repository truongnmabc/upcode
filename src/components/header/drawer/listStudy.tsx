"use client";
import { handleGetNextPart } from "@/components/home/gridTopic/item/titleTopic";
import { db } from "@/db/db.model";
import { ITopic } from "@/models/topics/topics";
import { appInfoState } from "@/redux/features/appInfo";
import { selectSubTopics, selectTopics } from "@/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import { trackingEventGa4 } from "@/services/googleEvent";
import ctx from "@/utils/mergeClass";
import { revertPathName } from "@/utils/pathName";
import { ExpandMore } from "@mui/icons-material";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const ListStudyDrawer = ({
    setOpenMenuDrawer,
}: {
    setOpenMenuDrawer: (e: boolean) => void;
}) => {
    const { appInfo } = useAppSelector(appInfoState);
    const [isExpand, setIsExpand] = useState(false);

    const [list, setList] = useState<ITopic[]>([]);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleGetDataTopic = useCallback(async () => {
        const data = await db?.topics.toArray();
        if (data) setList(data);
    }, []);

    useEffect(() => {
        handleGetDataTopic();
    }, [handleGetDataTopic]);

    const handleClick = useCallback(
        async (topic: ITopic) => {
            trackingEventGa4({
                eventName: "click_topic",
                value: {
                    from: window.location.href,
                    to: topic.tag,
                },
            });
            const { tag, subTopicTag, partId, subTopicId } =
                await handleGetNextPart({
                    parentId: topic.id,
                });
            const _href = revertPathName({
                href: `study/${topic.tag}-practice-test?type=learn&subTopic=${subTopicTag}&tag=${tag}`,
                appName: appInfo.appShortName,
            });
            dispatch(selectTopics(topic.id));
            if (subTopicId) dispatch(selectSubTopics(subTopicId));

            if (tag && subTopicTag) {
                dispatch(
                    initQuestionThunk({
                        partTag: tag,
                        subTopicTag,
                        partId,
                        subTopicId,
                    })
                );
            }
            setOpenMenuDrawer(false);
            router.push(_href);
        },
        [router, appInfo.appShortName, dispatch, setOpenMenuDrawer]
    );

    return (
        <div className="p-3">
            <div
                className="flex justify-start cursor-pointer gap-4 items-center"
                onClick={() => {
                    setIsExpand(!isExpand);
                }}
            >
                <div className=" font-poppins text-2xl capitalize font-semibold">
                    {appInfo.appShortName} Sub Test
                </div>

                <div
                    className={clsx("transition-all", {
                        "rotate-180": !isExpand,
                    })}
                >
                    <ExpandMore />{" "}
                </div>
            </div>

            <div
                className={ctx("transition-all mt-1", {
                    hidden: !isExpand,
                    block: isExpand,
                })}
            >
                {list.map((item, index) => (
                    <div
                        className="hover:bg-[#2121211f] relative overflow-hidden cursor-pointer"
                        onClick={() => handleClick(item)}
                        key={index}
                    >
                        <div className="p-2 text-lg">{item.name}</div>
                        {index + 1 < list.length && (
                            <div className="w-full h-[1px] bg-[#e4e4e4] "></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(ListStudyDrawer);
