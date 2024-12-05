"use client";
import { db } from "@/lib/db/db.model";
import { IPartProgress } from "@/lib/models/progress/subTopicProgress";
import { ITopic } from "@/lib/models/topics/topics";
import { studyState } from "@/lib/redux/features/study";
import { useAppSelector } from "@/lib/redux/hooks";
import { groupTopics } from "@/utils/math";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import IconProgress from "./iconProgress";

const FN = ({ subTopic }: { subTopic: ITopic }) => {
  const arr = groupTopics(subTopic?.topics || [], 3);

  const { selectedSubTopics } = useAppSelector(studyState);

  const isExpand = selectedSubTopics === subTopic.id;

  const [listPlayed, setListPlayed] = useState<IPartProgress[]>([]);

  const handleCheckProgress = async () => {
    if (subTopic.id) {
      const subTopicProgress = await db.subTopicProgress
        .where("id")
        .equals(subTopic.id)
        .first();
      if (subTopicProgress && subTopicProgress.part) {
        setListPlayed(subTopicProgress.part);
      }
    }
  };

  useEffect(() => {
    handleCheckProgress();
  }, [subTopic]);

  return (
    <div
      className={clsx(
        "w-full  h-full bg-[#F3F5F6] py-2 justify-center rounded-b-md  transition-all ",
        {
          flex: isExpand,
          hidden: !isExpand,
        }
      )}
    >
      <div className="flex flex-wrap gap-2 w-[200px]">
        {arr?.length > 0 &&
          arr.map((line, index) => (
            <div
              className={clsx(
                "flex w-[200px] relative transition-all  flex-wrap gap-4",
                {
                  "justify-center": index === 0,
                  "justify-start": index % 2 === 0,
                  "flex-row-reverse": index % 2 === 1,
                }
              )}
              key={index}
            >
              {line.value.map((part, i) => (
                <IconProgress
                  part={part}
                  subTopicTag={subTopic.tag}
                  index={i}
                  total={line?.value?.length}
                  key={i}
                  listPlayed={listPlayed}
                />
              ))}

              {/* {index % 2 == 0 && index < arr.length - 1 && <HalfCircleRight />} */}
              {/* {index % 2 == 1 && index < arr.length - 1 && <HalfCircleLeft />} */}
            </div>
          ))}
      </div>
    </div>
  );
};
const TopicLevelProgress = React.memo(FN);
export default TopicLevelProgress;
