"use client";
import LazyLoadImage from "@/components/images";
import MtUiRipple, { useRipple } from "@/components/ripple";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IPartProgress } from "@/models/progress/subTopicProgress";
import { ITopic } from "@/models/topics/topics";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { setIndexSubTopic } from "@/redux/features/game";
import { selectSubTopics, selectTopics } from "@/redux/features/study";
import { selectTopicsId } from "@/redux/features/study.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import { AppDispatch } from "@/redux/store";
import RouterApp from "@/router/router.constant";
import { trackingEventGa4 } from "@/services/googleEvent";
import ctx from "@/utils/mergeClass";
import clsx from "clsx";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
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
    index?: number;
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
            index: 0,
        };
    }

    const incompleteProgress = progress.find(
        (item) => !item.pass && item.part?.some((p) => p.status === 0)
    );

    const nextPart = incompleteProgress?.part?.find((p) => p.status === 0);

    const index = incompleteProgress?.part?.findIndex((p) => p === nextPart);
    return {
        tag: nextPart?.tag,
        subTopicTag: incompleteProgress?.subTopicTag || "",
        subTopicId: incompleteProgress?.id,
        index: index,
    };
};

type IPropsHandleNavigateStudy = {
    topic: ITopic;
    dispatch: AppDispatch;
    router: AppRouterInstance;
    appShortName: string;
    isReplace?: boolean;
};
export const handleNavigateStudy = async ({
    topic,
    dispatch,
    router,
    isReplace = false,
}: IPropsHandleNavigateStudy) => {
    const { tag, subTopicTag, partId, subTopicId, index } =
        await handleGetNextPart({
            parentId: topic.id,
            topic,
        });
    const _href = `/study/${topic.tag}-practice-test?type=learn&subTopic=${subTopicTag}&tag=${tag}`;
    dispatch(selectTopics(topic.id));

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
    if (subTopicId) dispatch(selectSubTopics(subTopicId));
    dispatch(setIndexSubTopic((index || 0) + 1));

    if (isReplace) return router.replace(_href);
    router.push(_href);
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
    const appInfo = useAppSelector(selectAppInfo);
    const router = useRouter();
    const currentPathname = usePathname();
    const isMobile = useIsMobile();
    const selectedTopics = useAppSelector(selectTopicsId);
    const dispatch = useAppDispatch();

    const isAllowExpand = selectedTopics === topic?.id;

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
            return handleNavigateStudy({
                appShortName: appInfo.appShortName,
                dispatch,
                router,
                topic,
            });
        }

        dispatch(selectTopics(isAllowExpand ? -1 : topic.id));
    };

    const {
        ripples,
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
    } = useRipple();

    return (
        <div
            className={ctx(
                "flex items-center relative p-2 overflow-hidden hover:border-primary bg-white max-h-[52px] sm:max-h-[74px] cursor-pointer w-full transition-all  border-solid border border-[#2121211F]",
                {
                    "rounded-tl-md rounded-tr-md ": isAllowExpand,
                    "rounded-md ": !isAllowExpand,
                },
                classNames
            )}
            onClick={handleClick}
        >
            <div
                className={ctx(
                    "rounded-md border-solid bg-primary-16 border-primary transition-all flex items-center rounded-tl-md  justify-center",
                    imgClassNames
                )}
            >
                {topic.icon ? (
                    <LazyLoadImage
                        src={topic.icon}
                        alt={appInfo?.appName + topic.name + "Practice Test"}
                        classNames={clsx({
                            "w-6  h-6  ": currentPathname.includes("/study"),
                            "w-6  h-6 sm:w-8 sm:h-8 ":
                                !currentPathname.includes("/study"),
                        })}
                        priority={false}
                        styles={{
                            filter: "brightness(0) saturate(100%) invert(81%) sepia(50%) saturate(2746%) hue-rotate(336deg) brightness(100%) contrast(98%) ",
                        }}
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
