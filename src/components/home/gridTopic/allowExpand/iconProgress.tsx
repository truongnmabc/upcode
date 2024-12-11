"use client";
import { db } from "@/db/db.model";
import { IPartProgress } from "@/models/progress/subTopicProgress";
import { ITopic } from "@/models/topics/topics";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState } from "@/redux/features/game";
import { setOptQuery } from "@/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import { revertPathName } from "@/utils/pathName";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { IconSubTopic } from "./iconTopic";
import { AllowExpandContext, IContextAllowExpand } from "./provider";
type IProps = {
  part: ITopic;
  index: number;
  subTopicTag: string;
  isCurrentPlaying?: IPartProgress;
  listPass?: number[];
};

const IconProgress = ({
  part,
  index,
  subTopicTag,
  isCurrentPlaying,
  listPass,
}: IProps) => {
  const { appInfo } = useAppSelector(appInfoState);
  const { currentGame, listQuestion } = useAppSelector(gameState);
  const { mainTopicTag } = useContext<IContextAllowExpand>(AllowExpandContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  const handleListenerChange = useCallback(async () => {
    const result = await db.userProgress
      .where("parentId")
      .equals(part.id)
      .toArray();

    const pass = result.filter((item) => item.selectedAnswers?.correct);

    setProgress(Math.floor((pass.length / listQuestion.length) * 100));
  }, [part.id, listQuestion]);

  useEffect(() => {
    if (isCurrentPlaying && currentGame.id && part.id) {
      handleListenerChange();
    }
  }, [isCurrentPlaying, currentGame.id, part.id, listQuestion]);

  const handleClick = useCallback(async () => {
    if (listPass?.includes(part.id)) {
      const _href = revertPathName({
        href: `finish/${mainTopicTag}-practice-test?type=learn&subTopic=${subTopicTag}&tag=${part?.tag}`,
        appName: appInfo.appShortName,
      });
      return router.push(_href);
    }
    if (part.id === isCurrentPlaying?.id) {
      // trackingEventGa4({

      // })

      const _href = revertPathName({
        href: `study/${mainTopicTag}-practice-test?type=learn&subTopic=${subTopicTag}&tag=${part?.tag}`,
        appName: appInfo.appShortName,
      });

      dispatch(
        initQuestionThunk({
          partTag: part?.tag,
          subTopicTag,
        })
      );
      if (pathname.includes("/study")) {
        return router.replace(_href);
      }
      return router.push(_href);
    }
  }, [part, isCurrentPlaying]);

  return (
    <>
      <div
        className={clsx(
          "w-14 z-10  flex flex-col  items-center justify-center",
          {
            "cursor-pointer": isCurrentPlaying,
            "cursor-not-allowed": !isCurrentPlaying,
          }
        )}
        key={index}
        onClick={handleClick}
      >
        <IconSubTopic
          lock={part.id !== isCurrentPlaying?.id}
          activeAnim={currentGame.parentId === part?.id}
          isFinishThisLevel={listPass?.includes(part.id) || false}
          currentLevelScore={progress}
        />

        <div className="max-w-14 text-center pt-1 text-[10px] text-[#212121] truncate">
          Core {index + 1}
        </div>
      </div>
    </>
  );
};

export default IconProgress;
