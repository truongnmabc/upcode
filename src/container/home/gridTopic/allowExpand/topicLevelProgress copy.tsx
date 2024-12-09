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

type CanvasRenderingContext2DOrNull = CanvasRenderingContext2D | null;

type CenterPosition = {
  x: number;
  y: number;
};

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

  useEffect(() => {
    const canvas = document.getElementById(
      "lineCanvas"
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx: CanvasRenderingContext2DOrNull = canvas.getContext("2d");
    if (!ctx) return;

    const container = document.getElementById(
      "container"
    ) as HTMLDivElement | null;
    if (!container) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const icons = document.querySelectorAll<HTMLDivElement>(".iconDrawCanvas");

    function getCenterPosition(element: HTMLDivElement): CenterPosition {
      const rect = element.getBoundingClientRect();
      if (container) {
        const containerRect = container.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      }
      return {
        x: 0,
        y: 0,
      };
    }

    ctx.strokeStyle = "#fcb03b";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);

    for (let i = 0; i < icons.length - 1; i++) {
      const start = getCenterPosition(icons[i]);
      const end = getCenterPosition(icons[i + 1]);
      // drawCurvedLine(start, end);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }, []);

  return (
    <div
      className={clsx(
        "w-full  h-full relative bg-[#F3F5F6] py-2 justify-center rounded-b-md  transition-all ",
        {
          flex: isExpand,
          hidden: !isExpand,
        }
      )}
      id="container"
    >
      <div className="flex   flex-wrap gap-2 w-[200px]">
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
                  key={i}
                  listPlayed={listPlayed}
                />
              ))}
            </div>
          ))}
      </div>
      <canvas
        id="lineCanvas"
        className="absolute w-full h-full top-0 left-0  z-0"
      />
    </div>
  );
};
const TopicLevelProgress = React.memo(FN);
export default TopicLevelProgress;
