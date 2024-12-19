"use client";
import RouterApp from "@/common/router/router.constant";
import LazyLoadImage from "@/components/images";
import MtUiRipple, { useRipple } from "@/components/ripple";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IPartProgress } from "@/models/progress/subTopicProgress";
import { ITopic } from "@/models/topics/topics";
import { appInfoState } from "@/redux/features/appInfo";
import {
    selectSubTopics,
    selectTopics,
    studyState,
} from "@/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import { trackingEventGa4 } from "@/services/googleEvent";
import ctx from "@/utils/mergeClass";
import { convertPathName, revertPathName } from "@/utils/pathName";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Priority from "./priority";

export const handleGetNextPart = async ({
    parentId,
    topic,
}: {
    parentId: number;
    topic?: ITopic;
}): Promise<{
    tag?: string;
    subTopicTag: string;
    partId?: number;
    subTopicId?: number;
}> => {
    const progress =
        (await db?.subTopicProgress
            .where("parentId")
            .equals(parentId)
            .toArray()) || [];

    if (!progress.length && topic) {
        const firstTopic = topic.topics?.[0];
        const firstSubTopic = firstTopic?.topics?.[0];

        const part = firstTopic?.topics?.map((item) => ({
            id: item.id || -1,
            parentId: item.parentId,
            status: 0,
            totalQuestion: item?.totalQuestion || 0,
            tag: item.tag,
            turn: 1,
        })) as IPartProgress[];

        await db?.subTopicProgress.add({
            id: firstTopic?.id || 0,
            parentId: topic.id,
            part: part,
            subTopicTag: firstTopic?.tag || "",
            pass: false,
        });

        return {
            tag: firstSubTopic?.tag || "",
            subTopicTag: firstTopic?.tag || "",
            partId: firstSubTopic?.id,
            subTopicId: firstTopic?.id,
        };
    }

    const incompleteProgress = progress.find(
        (item) => !item.pass && item.part?.some((p) => p.status === 0)
    );

    const nextPart = incompleteProgress?.part?.find((p) => p.status === 0);

    return {
        tag: nextPart?.tag,
        subTopicTag: incompleteProgress?.subTopicTag || "",
        subTopicId: incompleteProgress?.id,
    };
};

const TitleTopic = ({
    topic,
    priority,
    classNames,
    imgClassNames,
}: {
    topic: ITopic;
    priority: number;
    classNames: string;
    imgClassNames?: string;
}) => {
    const { appInfo } = useAppSelector(appInfoState);
    const router = useRouter();
    const pathname = usePathname();

    const [currentPathname, setCurrentPathname] = useState(pathname);

    const isMobile = useIsMobile();
    const { selectedTopics } = useAppSelector(studyState);
    const disPatch = useAppDispatch();

    const isAllowExpand = selectedTopics === topic?.id;

    useEffect(() => {
        const path = convertPathName(pathname);
        setCurrentPathname(path);
    }, [pathname]);

    const handleClick: React.MouseEventHandler<HTMLDivElement> = async (e) => {
        onRippleClickHandler(e);
        trackingEventGa4({
            eventName: "click_topic",
            value: {
                from: window.location.href,
                to: topic.tag,
            },
        });

        if (!isMobile && currentPathname === RouterApp.Home) {
            const { tag, subTopicTag, partId, subTopicId } =
                await handleGetNextPart({
                    parentId: topic.id,
                    topic,
                });

            const _href = revertPathName({
                href: `study/${topic.tag}-practice-test?type=learn&subTopic=${subTopicTag}&tag=${tag}`,
                appName: appInfo.appShortName,
            });
            disPatch(selectTopics(topic.id));
            if (subTopicId) disPatch(selectSubTopics(subTopicId));

            if (tag && subTopicTag) {
                disPatch(
                    initQuestionThunk({
                        partTag: tag,
                        subTopicTag,
                        partId,
                        subTopicId,
                    })
                );
            }
            router.push(_href);
            return;
        }

        disPatch(selectTopics(isAllowExpand ? -1 : topic.id));
    };

    const {
        ripples,
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
    } = useRipple();

    return (
        <div
            className={ctx(
                "flex items-center relative overflow-hidden  bg-white max-h-[52px] sm:max-h-[74px] cursor-pointer w-full transition-all  border-solid border border-[#2121211F]",
                {
                    "rounded-tl-md rounded-tr-md ": isAllowExpand,
                    "rounded-md ": !isAllowExpand,
                },
                classNames
            )}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                    topic.color || "";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                    "#2121211F";
            }}
            onClick={handleClick}
        >
            <div
                className={ctx(
                    " border border-solid  transition-all flex items-center rounded-tl-md  justify-center",
                    {
                        "rounded-bl-md":
                            !isAllowExpand &&
                            currentPathname === RouterApp.Home,
                        "sm:p-2": currentPathname.includes("/study"),
                    },
                    imgClassNames
                )}
                style={{
                    background: topic.color,
                    borderColor: topic.color,
                }}
            >
                {topic.icon ? (
                    <LazyLoadImage
                        src={topic.icon}
                        alt={appInfo?.appName + topic.name + "Practice Test"}
                        classNames="w-6  h-6 sm:w8 sm:h-8"
                        priority={false}
                    />
                ) : (
                    <div className="w-8 h-8"></div>
                )}
            </div>
            <Priority name={topic.name} priority={priority} />
            <MtUiRipple ripples={ripples} onClear={onClearRipple} />
        </div>
    );
};

export default TitleTopic;
