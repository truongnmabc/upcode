import { MtUiButton } from "@/components/button";
import { db } from "@/db/db.model";
import { ITopic } from "@/models/topics/topics";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { setIndexSubTopic, setTurtGame } from "@/redux/features/game";
import { selectCurrentSubTopicIndex } from "@/redux/features/game.reselect";
import { selectSubTopics } from "@/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type NavigateToHrefParams = {
    topicName: string;
    subTopicTag: string;
    partTag: string;
    appShortName: string;
};

const PassingFinishPage = ({
    nextPart,
    currentPartTag,
    currentTurn,
    passing,
    extraPoint,
}: {
    currentPartTag: string;
    nextPart: {
        subTopicTag: string;
        tag: string;
    };
    currentTurn: number;
    passing: number;
    extraPoint: number;
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const topicName = useSearchParams()?.get("topic");
    const appInfo = useAppSelector(selectAppInfo);
    const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);

    const navigateToHref = useCallback(
        ({ topicName, subTopicTag, partTag }: NavigateToHrefParams) => {
            dispatch(
                initQuestionThunk({
                    partTag: partTag,
                    subTopicTag: subTopicTag,
                })
            );
            const _href = `study/${topicName}?type=learn&subTopic=${subTopicTag}&tag=${partTag}`;
            router.replace(_href);
        },
        [dispatch, router]
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
        [navigateToHref, appInfo.appShortName, topicName]
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
                    const index = subTopic?.part?.findIndex(
                        (p) => p === nextPart
                    );

                    if (nextPart && topicName) {
                        navigateToHref({
                            topicName,
                            partTag: nextPart.tag,
                            subTopicTag: subTopic.subTopicTag,
                            appShortName: appInfo.appShortName,
                        });
                        dispatch(setIndexSubTopic(index + 1));
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
    }, [appInfo.appShortName, topicName, dispatch, updateDb, navigateToHref]);

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
            appInfo.appShortName
        ) {
            navigateToHref({
                topicName,
                partTag: nextPart.tag,
                subTopicTag: nextPart.subTopicTag,
                appShortName: appInfo.appShortName,
            });

            dispatch(setIndexSubTopic(indexSubTopic + 1));

            return;
        }

        await handleNextSubTopic();
    }, [
        nextPart,
        navigateToHref,
        appInfo.appShortName,
        dispatch,
        topicName,
        handleNextSubTopic,
        indexSubTopic,
    ]);

    const handleTryAgainFn = useCallback(async () => {
        if (currentPartTag && nextPart.subTopicTag) {
            dispatch(
                setTurtGame({
                    turn: currentTurn + 1,
                })
            );
            dispatch(
                initQuestionThunk({
                    partTag: currentPartTag,
                    subTopicTag: nextPart.subTopicTag,
                    isReset: true,
                })
            );

            const _href = `study/${topicName}?type=learn&subTopic=${nextPart.subTopicTag}&tag=${currentPartTag}`;

            router.replace(_href);
        }
    }, [
        currentPartTag,
        currentTurn,
        nextPart.subTopicTag,
        topicName,
        dispatch,
        router,
    ]);

    const oldPassing = passing - extraPoint;

    return (
        <div className="flex w-full  flex-col justify-center items-center">
            <div className="w-full rounded-xl bg-[#7C6F5BAD] gap-6 items-center flex px-4 py-2 ">
                <div className="flex items-center flex-col sm:flex-row justify-start gap-2">
                    <p className="text-xs sm:text-lg max-w-32 sm:max-w-72 text-center font-medium text-white">
                        Passing Probability{" "}
                    </p>
                    <span className="text-2xl text-white">
                        {passing.toFixed(4)} %
                    </span>
                </div>

                <div className="bg-white custom-progress rounded-lg h-9  flex-1 relative">
                    <div className="w-full absolute p-2 inset-0 z-10">
                        <progress
                            value={passing.toFixed(2)}
                            max={passing.toFixed(2)}
                            className="rounded-lg"
                            style={{
                                width: `${passing}%`,
                            }}
                        ></progress>
                    </div>
                    <div className="w-full absolute p-2  inset-0 z-20">
                        <progress
                            value={oldPassing.toFixed(2)}
                            max={oldPassing.toFixed(2)}
                            className=" rounded-lg"
                            style={{
                                width: `${oldPassing}%`,
                                background: "#12E1AF",
                            }}
                        ></progress>
                    </div>

                    <p className="absolute text-[#12E1AF] text-base right-2 top-0 bottom-0 flex items-center z-10">
                        {" "}
                        + {extraPoint.toFixed(2)} %
                    </p>
                </div>
            </div>

            <div className="flex fixed sm:static bottom-0 left-0 z-20 bg-theme-white   sm:bg-transparent pb-8 sm:pb-2 px-4 pt-6 gap-4 max-w-[480px] w-full items-center">
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
                    Continue
                </MtUiButton>
            </div>
        </div>
    );
};

export default PassingFinishPage;
