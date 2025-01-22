"use client";
import { db } from "@/db/db.model";
import { IPartProgress } from "@/models/progress/subTopicProgress";
import { ITopic } from "@/models/topics/topics";
import { setIndexSubTopic, setTurtGame } from "@/redux/features/game";
import {
    selectCurrentGame,
    selectCurrentTopicId,
    selectListQuestion,
    selectAttemptNumber,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { IconSubTopic } from "./iconTopic";
import { AllowExpandContext, IContextAllowExpand } from "./provider";
type IProps = {
    part: ITopic;
    index: number;
    subTopicTag: string;
    isCurrentPlaying?: IPartProgress;
    subTopic: ITopic;
    isPass: boolean;
};

const IconProgress = ({
    part,
    index,
    subTopicTag,
    isCurrentPlaying,
    subTopic,
    isPass,
}: IProps) => {
    const currentGame = useAppSelector(selectCurrentGame);
    const listQuestion = useAppSelector(selectListQuestion);
    const turn = useAppSelector(selectAttemptNumber);
    const idTopic = useAppSelector(selectCurrentTopicId);

    const { mainTopicTag } =
        useContext<IContextAllowExpand>(AllowExpandContext);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const tag = useSearchParams()?.get("tag");
    const [progress, setProgress] = useState(0);

    const handleListenerChange = useCallback(async () => {
        const result =
            (await db?.userProgress
                .filter((item) => item.parentIds.includes(part.id))
                .toArray()) || [];

        const pass = result.filter((item) =>
            item.selectedAnswers?.find(
                (ans) => ans.turn === turn && ans.correct
            )
        );

        setProgress(Math.floor((pass.length / listQuestion.length) * 100));
    }, [part.id, listQuestion, turn]);

    const handleClick = useCallback(async () => {
        if (
            pathname?.includes(`/study/${mainTopicTag}-practice-test`) &&
            tag === part.tag
        ) {
            return;
        }

        dispatch(setIndexSubTopic(index));

        if (isPass) {
            const _href = `/finish?subTopicProgressId=${subTopic.id}&topic=${mainTopicTag}-practice-test&partId=${part.id}`;
            return router.push(_href);
        }
        if (part.id === isCurrentPlaying?.id) {
            // trackingEventGa4({

            // })

            const _href = `/study/${mainTopicTag}-practice-test?type=learn&subTopic=${subTopicTag}&tag=${part?.tag}`;

            dispatch(
                initQuestionThunk({
                    partTag: part?.tag,
                    subTopicTag,
                })
            );
            dispatch(
                setTurtGame({
                    turn: 1,
                })
            );
            if (pathname?.includes("/study")) {
                return router.replace(_href);
            }

            return router.push(_href);
        }
    }, [
        part,
        isCurrentPlaying,
        isPass,
        dispatch,
        mainTopicTag,
        pathname,
        router,
        subTopic.id,
        subTopicTag,
        tag,
        index,
    ]);

    useEffect(() => {
        if (
            (!isPass || (isPass && idTopic === part.id)) &&
            isCurrentPlaying &&
            idTopic &&
            part.id &&
            idTopic === part.id
        ) {
            handleListenerChange();
        }
    }, [
        isCurrentPlaying,
        idTopic,
        part.id,
        listQuestion,
        isPass,
        handleListenerChange,
        turn,
    ]);

    return (
        <div
            className={clsx(
                "w-14 z-10  flex flex-col  items-center justify-center",
                {
                    "cursor-pointer": isPass || isCurrentPlaying,
                    "cursor-not-allowed": !isCurrentPlaying,
                }
            )}
            key={index}
            onClick={handleClick}
        >
            <IconSubTopic
                lock={part.id !== isCurrentPlaying?.id}
                activeAnim={currentGame.parentId === part?.id}
                isFinishThisLevel={isPass}
                currentLevelScore={
                    isPass && currentGame.parentId !== part?.id
                        ? progress
                        : currentGame.parentId !== part?.id && isPass
                        ? 100
                        : progress
                }
            />

            <div className="max-w-14 text-center pt-1 text-[10px] text-[#212121] truncate">
                Core {index}
            </div>
        </div>
    );
};

export default IconProgress;
