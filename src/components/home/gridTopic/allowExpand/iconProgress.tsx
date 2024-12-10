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
import { useContext, useEffect, useState } from "react";
import { IconSubTopic } from "./iconTopic";
import { AllowExpandContext, IContextAllowExpand } from "./provider";
type IProps = {
  part: ITopic;
  index: number;
  subTopicTag: string;
  listPlayed: IPartProgress[];
};

const IconProgress = ({ part, index, subTopicTag, listPlayed }: IProps) => {
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
        className={clsx(
          "w-14 z-10  flex flex-col  items-center justify-center",
          {
            "cursor-pointer": isCurrentPlaying,
            "cursor-not-allowed": !isCurrentPlaying,
          }
        )}
        key={index}
        onClick={async () => {
          if (isCurrentPlaying) {
            // trackingEventGa4({

            // })
            // if (pathname.includes("/study")) {
            //   dispatch(
            //     initQuestionThunk({
            //       partTag: part?.tag,
            //       subTopicTag,
            //     })
            //   );
            //   dispatch(
            //     setOptQuery({
            //       partTag: part?.tag,
            //       subTopicTag: subTopicTag,
            //     })
            //   );
            //   return;
            // }

            const _href = revertPathName({
              href: `study/${mainTopicTag}-practice-test?type=learn&subTopic=${subTopicTag}&tag=${part?.tag}`,
              appName: appInfo.appShortName,
            });

            router.replace(_href);
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
          Core {index + 1}
        </div>
      </div>
    </>
  );
};

export default IconProgress;
