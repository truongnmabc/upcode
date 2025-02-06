"use client";
import LazyLoadImage from "@/components/images";
import MtUiRipple, { useRipple } from "@/components/ripple";
import RouterApp from "@/constants/router.constant";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectSubTopics, selectTopics } from "@/redux/features/study";
import { selectTopicsId } from "@/redux/features/study.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initLearnQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import { AppDispatch } from "@/redux/store";
import { trackingEventGa4 } from "@/services/googleEvent";
import ctx from "@/utils/mergeClass";
import clsx from "clsx";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Priority from "./priority";
import { setIndexSubTopic, setTurtGame } from "@/redux/features/game";

export const handleGetNextPart = async ({
    topic,
}: {
    topic: ITopicBase;
}): Promise<{
    partId?: number;
    subTopicId: number;
    allCompleted?: boolean;
    currentIndex: number;
    turn?: number;
}> => {
    const currentTopic = await db?.topics.where("id").equals(topic?.id).first();

    if (!currentTopic) {
        toast.error("Error: Can't get data");
        return {
            partId: undefined,
            subTopicId: -1,
            allCompleted: false,
            currentIndex: 0,
        };
    }
    //   trường hợp tất cả subtopic trong topic đã hoàn thành thì sẽ chuyển sang màn finish của subtopic cuối cùng
    if (currentTopic.status === 1) {
        const lastSubTopic =
            currentTopic?.topics?.[currentTopic.topics.length - 1];
        const lastPart = lastSubTopic?.topics?.[lastSubTopic.topics.length - 1];

        return {
            partId: lastPart?.id,
            subTopicId: lastSubTopic?.id,
            allCompleted: true,
            currentIndex: lastSubTopic?.topics?.findIndex(
                (item) => item.id === lastPart?.id
            ),
        };
    }

    const nextSubTopics = currentTopic.topics.find((item) => item.status === 0);
    if (!nextSubTopics)
        return {
            partId: undefined,
            subTopicId: -1,
            allCompleted: false,
            currentIndex: 0,
        };

    const nextPart = findNextPart(nextSubTopics);
    const currentIndex =
        nextSubTopics.topics.findIndex((item) => item.id === nextPart?.id) || 0;

    return {
        partId: nextPart?.id,
        subTopicId: nextPart?.parentId || -1,
        currentIndex,
        turn: nextPart?.turn,
    };
};

const findNextPart = (subTopic: ITopicBase) => {
    return subTopic.topics.find((item) => item.status === 0);
};

type IPropsHandleNavigateStudy = {
    topic: ITopicBase;
    dispatch: AppDispatch;
    router: AppRouterInstance;
    isReplace?: boolean;
};

export const handleNavigateStudy = async ({
    topic,
    dispatch,
    router,
    isReplace = false,
}: IPropsHandleNavigateStudy) => {
    const { partId, subTopicId, allCompleted, currentIndex, turn } =
        await handleGetNextPart({
            topic,
        });

    if (!partId) {
        toast.error("Error: Không tìm thấy partId hợp lệ");
        return;
    }
    if (allCompleted) {
        router.push(
            `${RouterApp.Finish}?partId=${partId}&subTopicId=${subTopicId}&topic=${topic.tag}`
        );
        return;
    }

    const _href = `/study/${topic.tag}-practice-test?type=learn&partId=${partId}&subTopicId=${subTopicId}`;

    dispatch(selectTopics(topic.id));
    dispatch(selectSubTopics(subTopicId));
    dispatch(setIndexSubTopic(currentIndex + 1));
    dispatch(
        initLearnQuestionThunk({
            partId: Number(partId),
            subTopicId: Number(subTopicId),
        })
    );
    if (turn)
        dispatch(
            setTurtGame({
                turn: turn,
            })
        );
    if (isReplace) return router.push(_href);
    router.push(_href);
};

const TitleTopic = ({
    topic,
    priority,
    classNames,
    imgClassNames,
}: {
    topic: ITopicBase;
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
                            "w-6  h-6  ": currentPathname?.includes("/study"),
                            "w-6  h-6 sm:w-8 sm:h-8 ":
                                !currentPathname?.includes("/study"),
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
