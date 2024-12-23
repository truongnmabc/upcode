import { MtUiButton } from "@/components/button";
import { db } from "@/db/db.model";
import { ITopic } from "@/models/topics/topics";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState, setTurtGame } from "@/redux/features/game";
import { selectSubTopics } from "@/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import { revertPathName } from "@/utils/pathName";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type NavigateToHrefParams = {
    topicName: string;
    subTopicTag: string;
    partTag: string;
    appShortName: string;
};

const PassingFinishPage = ({
    nextPart,
    currentPartTag,
}: {
    currentPartTag: string;
    nextPart: {
        subTopicTag: string;
        tag: string;
    };
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [passing] = useState(0);
    const topicName = useSearchParams().get("topic");
    const { appInfo } = useAppSelector(appInfoState);
    const { turn } = useAppSelector(gameState);

    const navigateToHref = useCallback(
        ({
            topicName,
            subTopicTag,
            partTag,
            appShortName,
        }: NavigateToHrefParams) => {
            dispatch(
                initQuestionThunk({
                    partTag: partTag,
                    subTopicTag: subTopicTag,
                })
            );
            const _href = revertPathName({
                href: `study/${topicName}?type=learn&subTopic=${subTopicTag}&tag=${partTag}`,
                appName: appShortName,
            });
            router.push(_href);
        },
        [dispatch]
    );

    const updateDb = useCallback(
        async ({
            currentTopic,
            listTopic,
        }: {
            listTopic: ITopic[];
            currentTopic: ITopic;
        }) => {
            await db?.topics
                .where("id")
                .equals(currentTopic?.id)
                .modify((item) => {
                    item.status = 1;
                });

            const nextMainTopic = listTopic?.find(
                (item) => item?.id !== currentTopic.id && item.status === 0
            );
            if (nextMainTopic && nextMainTopic.topics) {
                for (const subTopic of nextMainTopic.topics) {
                    const subTopicProgress = await db?.subTopicProgress
                        .where("id")
                        .equals(subTopic.id)
                        .first();

                    if (subTopicProgress && subTopicProgress.part) {
                        const nextPart = subTopicProgress.part?.find(
                            (item) => item.status === 0
                        );
                        if (nextPart && topicName) {
                            navigateToHref({
                                topicName,
                                partTag: nextPart.tag,
                                subTopicTag: subTopic.tag,
                                appShortName: appInfo.appShortName,
                            });
                            return;
                        }
                    }
                }
            }
        },
        [navigateToHref, db, appInfo.appShortName, topicName]
    );

    const handleNextSubTopic = useCallback(async () => {
        const listTopic = await db?.topics.toArray();

        // *NOTE : next subtopic tiếp theo trong 1 mainTopic

        const currentTopic = listTopic?.find((item) => item.slug === topicName);

        if (listTopic && currentTopic && currentTopic?.topics) {
            for (const t of currentTopic?.topics) {
                const subTopic = await db?.subTopicProgress
                    ?.where("id")
                    .equals(t.id)
                    .first();

                if (subTopic && !subTopic?.pass) {
                    const nextPart = subTopic.part?.find(
                        (item) => item?.status === 0
                    );
                    if (nextPart && topicName) {
                        navigateToHref({
                            topicName,
                            partTag: nextPart.tag,
                            subTopicTag: subTopic.subTopicTag,
                            appShortName: appInfo.appShortName,
                        });
                        dispatch(selectSubTopics(subTopic.id));
                        return;
                    }
                }
            }

            updateDb({
                currentTopic,
                listTopic,
            });
        }
    }, [appInfo.appShortName, topicName, db, navigateToHref]);

    const handleNextPart = useCallback(async () => {
        dispatch(
            setTurtGame({
                turn: 1,
            })
        );

        // *NOTE : next part tiếp theo trong 1 subtopic
        if (
            nextPart.subTopicTag &&
            nextPart.tag &&
            topicName &&
            appInfo &&
            appInfo.appShortName
        ) {
            navigateToHref({
                topicName,
                partTag: nextPart.tag,
                subTopicTag: nextPart.subTopicTag,
                appShortName: appInfo.appShortName,
            });
            return;
        }

        await handleNextSubTopic();
    }, [
        nextPart,
        navigateToHref,
        appInfo.appShortName,
        dispatch,
        router,
        topicName,
        handleNextSubTopic,
    ]);

    const handleTryAgainFn = useCallback(async () => {
        if (currentPartTag && nextPart.subTopicTag) {
            dispatch(
                setTurtGame({
                    turn: turn + 1,
                })
            );
            dispatch(
                initQuestionThunk({
                    partTag: currentPartTag,
                    subTopicTag: nextPart.subTopicTag,
                    isReset: true,
                })
            );

            const _href = revertPathName({
                href: `study/${topicName}?type=learn&subTopic=${nextPart.subTopicTag}&tag=${currentPartTag}`,
                appName: appInfo.appShortName,
            });
            router.push(_href);
        }
    }, [
        currentPartTag,
        nextPart.subTopicTag,
        topicName,
        appInfo.appShortName,
        dispatch,
        router,
        turn,
    ]);

    return (
        <div className="flex w-full  flex-col justify-center items-center">
            <div className="w-full rounded-xl bg-[#7C6F5BAD] gap-6 items-center flex px-4 py-2 ">
                <div className="flex items-center flex-col sm:flex-row justify-start gap-2">
                    <p className="text-xs sm:text-lg max-w-32 sm:max-w-72 text-center font-medium text-white">
                        Passing Probability{" "}
                    </p>
                    <span className="text-3xl text-white">{passing} %</span>
                </div>

                <div className="bg-white rounded-lg h-9 p-2 flex-1"></div>
            </div>

            <div className="flex fixed sm:static bottom-0 left-0 z-20 bg-theme-white   sm:bg-transparent pb-8 px-4 pt-6 gap-4 max-w-[480px] w-full items-center">
                <MtUiButton
                    className="text-primary border-primary"
                    block
                    size="large"
                    onClick={handleTryAgainFn}
                >
                    Try Again
                </MtUiButton>
                <MtUiButton
                    block
                    size="large"
                    onClick={handleNextPart}
                    type="primary"
                >
                    Next Part
                </MtUiButton>
            </div>
        </div>
    );
};

export default PassingFinishPage;
