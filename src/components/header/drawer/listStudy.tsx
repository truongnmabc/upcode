"use client";
import MtUiRipple, { useRipple } from "@/components/ripple";
import { db } from "@/db/db.model";
import SubTopicProgress from "@/models/progress/subTopicProgress";
import Part from "@/models/topics/part";
import { ITopic } from "@/models/topics/topics";
import { appInfoState } from "@/redux/features/appInfo";
import {
  selectSubTopics,
  selectTopics,
  setOptQuery,
} from "@/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import { trackingEventGa4 } from "@/services/googleEvent";
import ctx from "@/utils/mergeClass";
import { revertPathName } from "@/utils/pathName";
import { ExpandMore } from "@mui/icons-material";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";

const ListStudyDrawer = ({
  setOpenMenuDrawer,
}: {
  setOpenMenuDrawer: (e: boolean) => void;
}) => {
  const { appInfo } = useAppSelector(appInfoState);
  const [isExpand, setIsExpand] = useState(false);

  const [list, setList] = useState<ITopic[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleGetDataTopic = async () => {
      const data = await db.topics.toArray();
      if (data) setList(data);
    };
    handleGetDataTopic();
  }, []);

  const fetchSubTopicData = async (
    topic: ITopic
  ): Promise<{
    tag?: string;
    subTopicTag: string;
    partId?: number;
    subTopicId?: number;
  }> => {
    const parentId = topic.id;
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

    const nextPart = incompleteProgress?.part?.find((p) => p.status === 0);

    if (incompleteProgress) dispatch(selectSubTopics(incompleteProgress?.id));

    return {
      tag: nextPart?.tag,
      subTopicTag: incompleteProgress?.subTopicTag || "",
    };
  };

  const handleClick = async (topic: ITopic) => {
    trackingEventGa4({
      eventName: "click_topic",
      value: {
        from: window.location.href,
        to: topic.tag,
      },
    });
    const { tag, subTopicTag, partId, subTopicId } = await fetchSubTopicData(
      topic
    );
    const _href = revertPathName({
      href: `study/${topic.tag}-practice-test`,
      appName: appInfo.appShortName,
    });
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

      dispatch(
        setOptQuery({
          partTag: tag,
          subTopicTag: subTopicTag,
        })
      );
    }
    setOpenMenuDrawer(false);
    router.push(_href);
  };

  return (
    <div className="p-3">
      <div
        className="flex justify-start cursor-pointer gap-4 items-center"
        onClick={() => {
          setIsExpand(!isExpand);
        }}
      >
        <div className=" font-poppins text-lg capitalize font-semibold">
          {appInfo.appShortName} Sub Test
        </div>

        <div
          className={clsx("transition-all", {
            "rotate-180": !isExpand,
          })}
        >
          <ExpandMore />{" "}
        </div>
      </div>

      <div
        className={ctx("transition-all mt-1", {
          hidden: !isExpand,
          block: isExpand,
        })}
      >
        {list.map((item, index) => (
          <div
            className="hover:bg-[#2121211f] relative overflow-hidden cursor-pointer"
            onClick={() => handleClick(item)}
            key={index}
          >
            <div className="p-2 text-lg">{item.name}</div>
            {index + 1 < list.length && (
              <div className="w-full h-[1px] bg-[#e4e4e4] "></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ListStudyDrawer);
