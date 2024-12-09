"use client";
import RouterApp from "@/common/router/router.constant";
import LazyLoadImage from "@/components/images";
import MtUiRipple, { useRipple } from "@/components/ripple";
import { db } from "@/lib/db/db.model";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import SubTopicProgress from "@/lib/models/progress/subTopicProgress";
import Part from "@/lib/models/topics/part";
import { ITopic } from "@/lib/models/topics/topics";
import { appInfoState } from "@/lib/redux/features/appInfo";
import {
  selectSubTopics,
  selectTopics,
  setOptQuery,
  studyState,
} from "@/lib/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { trackingEventGa4 } from "@/lib/services/googleEvent";
import ctx from "@/utils/mergeClass";
import { convertPathName, revertPathName } from "@/utils/pathName";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Priority from "./priority";
import initQuestionThunk from "@/lib/redux/repository/game/initQuestion";

const TitleTopic = ({
  topic,
  priority,
}: {
  topic: ITopic;
  priority: number;
}) => {
  const { appInfo } = useAppSelector(appInfoState);
  const router = useRouter();
  const pathname = usePathname();

  const [currentPathname, setCurrentPathname] = useState(pathname);

  const isMobile = useIsMobile();
  const { selectedTopics } = useAppSelector(studyState);
  const [isAllowExpand, setIsAllowExpand] = useState(false);
  const disPatch = useAppDispatch();

  useEffect(() => {
    const path = convertPathName(pathname);
    setCurrentPathname(path);
  }, [pathname]);

  useEffect(() => {
    setIsAllowExpand(selectedTopics === topic?.id);
  }, [selectedTopics]);

  const fetchSubTopicData = async (
    parentId: number
  ): Promise<{
    tag?: string;
    subTopicTag: string;
    partId?: number;
    subTopicId?: number;
  }> => {
    const progress = await db.subTopicProgress
      .where("parentId")
      .equals(parentId)
      .toArray();

    if (!progress.length) {
      const firstTopic = topic.topics?.[0];
      const firstSubTopic = firstTopic?.topics?.[0];
      const newPart = new Part(firstSubTopic);

      await db.subTopicProgress.add(
        new SubTopicProgress({
          id: firstTopic?.id || 0,
          parentId: topic.id,
          part: [{ ...newPart, status: 0 }],
          subTopicTag: firstTopic?.tag || "",
        })
      );

      return {
        tag: newPart?.tag || "",
        subTopicTag: firstTopic?.tag || "",
        partId: firstSubTopic?.id,
        subTopicId: firstTopic?.id,
      };
    }

    const incompleteProgress = progress.find(
      (item) => !item.pass && item.part?.some((p) => p.status === 0)
    );
    console.log("🚀 ~ incompleteProgress:", incompleteProgress);

    const nextPart = incompleteProgress?.part?.find((p) => p.status === 0);
    console.log("🚀 ~ nextPart:", nextPart);

    if (incompleteProgress) disPatch(selectSubTopics(incompleteProgress?.id));

    return {
      tag: nextPart?.tag,
      subTopicTag: incompleteProgress?.subTopicTag || "",
    };
  };

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
      const { tag, subTopicTag, partId, subTopicId } = await fetchSubTopicData(
        topic.id
      );

      const _href = revertPathName({
        href: `study/${topic.tag}-practice-test`,
        appName: appInfo.appShortName,
      });
      disPatch(selectTopics(topic.id));

      if (tag && subTopicTag) {
        disPatch(
          initQuestionThunk({
            partTag: tag,
            subTopicTag,
            partId,
            subTopicId,
          })
        );

        disPatch(
          setOptQuery({
            partTag: tag,
            subTopicTag: subTopicTag,
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
        "flex items-center relative overflow-hidden h-full bg-white max-h-[74px] cursor-pointer w-full transition-all  border-solid border border-[#2121211F]",
        {
          "rounded-tl-md rounded-tr-md ": isAllowExpand,
          "rounded-md ": !isAllowExpand,
        }
      )}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          topic.color || "";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#2121211F";
      }}
      onClick={handleClick}
    >
      <div
        className={ctx(
          "p-2 sm:p-5 border border-solid h-full transition-all flex items-center rounded-tl-md  justify-center",
          {
            "rounded-bl-md":
              !isAllowExpand && currentPathname === RouterApp.Home,
            "sm:p-2": currentPathname.includes("/study"),
          }
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
