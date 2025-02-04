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
    isPass: boolean;
};

const IconProgress = ({ part, index, isPass }: IProps) => {
    const currentGame = useAppSelector(selectCurrentGame);
    const listQuestion = useAppSelector(selectListQuestion);
    const turn = useAppSelector(selectAttemptNumber);
    const idTopic = useAppSelector(selectCurrentTopicId);
    const isCurrentPlaying = idTopic === part?.id;

    const { mainTopicTag } =
        useContext<IContextAllowExpand>(AllowExpandContext);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const partId = useSearchParams()?.get("partId");
    const [progress, setProgress] = useState(0);

    const handleListenerChange = useCallback(async () => {
        console.log("🚀 ~ IconProgress ~ listQuestion:", part);

        const progress = await db?.userProgress
            .where("parentId")
            ?.equals(part.id)
            .toArray();
        console.log("🚀 ~ handleListenerChange ~ progress:", progress);

        // const result =
        //     (await db?.userProgress
        //         .filter((item) => item.parentIds.includes(part.id))
        //         .toArray()) || [];
        // const pass = result.filter((item) =>
        //     item.selectedAnswers?.find(
        //         (ans) => ans.turn === turn && ans.correct
        //     )
        // );
        // setProgress(Math.floor((pass.length / listQuestion.length) * 100));
    }, [part, listQuestion, turn]);

    const handleClick = useCallback(async () => {
        console.log("first");
        // if (Number(partId) === part.id) {
        //     return;
        // }

        dispatch(setIndexSubTopic(index));

        // if (isPass) {
        //     const _href = `/finish?subTopicProgressId=${subTopic.id}&topic=${mainTopicTag}-practice-test&partId=${part.id}`;
        //     return router.push(_href);
        // }
        if (part.id === isCurrentPlaying?.id) {
            const _href = `/study/${mainTopicTag}-practice-test?type=learn&partId=${part?.id}`;

            dispatch(
                initQuestionThunk({
                    partId: part.id,
                })
            );
            dispatch(
                setTurtGame({
                    turn: 1,
                })
            );
            if (pathname?.includes("/study")) {
                return router.push(_href);
            }

            return router.push(_href);
        }
    }, [part, isPass, dispatch, mainTopicTag, pathname, router, partId, index]);

    useEffect(() => {
        handleListenerChange();
    }, [handleListenerChange]);

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
                lock={!isCurrentPlaying && index !== 1}
                activeAnim={currentGame.parentId === part?.id}
                isFinishThisLevel={isPass}
                currentLevelScore={
                    isPass && currentGame.parentId !== part?.id
                        ? progress
                        : isCurrentPlaying && isPass
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
