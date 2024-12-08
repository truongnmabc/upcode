"use client";
import { db } from "@/lib/db/db.model";
import { IPartProgress } from "@/lib/models/progress/subTopicProgress";
import { ITopic } from "@/lib/models/topics/topics";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IconSubTopic } from "./iconTopic";
import { AllowExpandContext, IContextAllowExpand } from "./provider";
import initQuestionThunk from "@/lib/redux/repository/game/initQuestion";
import { setOptQuery } from "@/lib/redux/features/study";
import { gameState } from "@/lib/redux/features/game";
type IProps = {
  part: ITopic;
  index: number;
  total: number;
  subTopicTag: string;
  listPlayed: IPartProgress[];
};

const IconProgress = ({
  part,
  index,
  total,
  subTopicTag,
  listPlayed,
}: IProps) => {
  const { appInfo } = useAppSelector(appInfoState);
  const { currentGame, listQuestion } = useAppSelector(gameState);
  const { mainTopicTag } = useContext<IContextAllowExpand>(AllowExpandContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const isCurrentPlaying = listPlayed.find((item) => item.id === part.id);

  const handleListenerChange = async () => {
    const result = await db.userProgress
      .where("parentId")
      .equals(part.id)
      .toArray();

    const pass = result.filter((item) => item.selectedAnswers?.correct);

    setProgress(Math.floor((pass.length / listQuestion.length) * 100));
  };
  useEffect(() => {
    if (isCurrentPlaying && currentGame.id && part.id) {
      handleListenerChange();
    }
  }, [isCurrentPlaying, currentGame.id, part.id, listQuestion]);

  return (
    <>
      <div
        className={clsx("w-14 flex flex-col  items-center justify-center", {
          "cursor-pointer": isCurrentPlaying,
          "cursor-not-allowed": !isCurrentPlaying,
        })}
        key={index}
        onClick={async () => {
          if (isCurrentPlaying) {
            // trackingEventGa4({

            // })
            if (pathname.includes("/study")) {
              dispatch(
                initQuestionThunk({
                  partTag: part?.tag,
                  subTopicTag,
                })
              );
              dispatch(
                setOptQuery({
                  partTag: part?.tag,
                  subTopicTag: subTopicTag,
                })
              );
              return;
            }

            const _href = revertPathName({
              href: `study/${mainTopicTag}-practice-test`,
              appName: appInfo.appShortName,
            });

            router.push(_href);
          }
        }}
      >
        <IconSubTopic
          lock={!isCurrentPlaying ? true : false}
          activeAnim={
            isCurrentPlaying && currentGame.parentId === isCurrentPlaying.id
              ? true
              : false
          }
          isFinishThisLevel={isCurrentPlaying?.status === 1}
          currentLevelScore={progress}
        />

        <div className="max-w-14 text-center pt-1 text-[10px] text-[#212121] truncate">
          {part.name}
        </div>
      </div>
      {index < total - 1 && false && (
        <div className="w-6 mt-8 h-[1px] border-dashed border-b border-[var(--text-color-primary)]"></div>
      )}
    </>
  );
};

export default IconProgress;
