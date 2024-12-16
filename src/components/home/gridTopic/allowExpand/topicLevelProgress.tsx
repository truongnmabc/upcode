"use client";
import { db } from "@/db/db.model";
import { IPartProgress } from "@/models/progress/subTopicProgress";
import { ITopic } from "@/models/topics/topics";
import { studyState } from "@/redux/features/study";
import { useAppSelector } from "@/redux/hooks";
import { groupTopics } from "@/utils/math";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import IconProgress from "./iconProgress";

type CanvasRenderingContext2DOrNull = CanvasRenderingContext2D | null;

type CenterPosition = {
    x: number;
    y: number;
};

function drawCurvedLine(
    start: CenterPosition,
    end: CenterPosition,
    ctx: CanvasRenderingContext2DOrNull,
    isRight: boolean
) {
    const centerPoint = {
        x: (start.x + end.x) / 2 + (isRight ? 20 : -20),
        y: (start.y + end.y) / 2,
    };
    const radius = Math.abs(Math.ceil(end.y - start.y)) / 2;

    if (ctx) {
        ctx.beginPath();
        if (isRight) {
            ctx.arc(
                centerPoint.x,
                centerPoint.y,
                radius,
                (3 * Math.PI) / 2,
                Math.PI / 2,
                false
            );
        } else {
            ctx.arc(
                centerPoint.x,
                centerPoint.y,
                radius,
                Math.PI / 2,
                (3 * Math.PI) / 2,
                false
            );
        }

        ctx.fillStyle = "transparent";
        ctx.fill();
        ctx.strokeStyle = "#fcb03b";
        ctx.stroke();
    }
}

function getCenterPosition(
    element: HTMLDivElement,
    container: HTMLDivElement | null
): CenterPosition {
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

const TopicLevelProgress = ({ subTopic }: { subTopic: ITopic }) => {
    const arr = groupTopics(subTopic?.topics || [], 3);

    const { selectedSubTopics } = useAppSelector(studyState);

    const isExpand = selectedSubTopics === subTopic.id;

    const [listPlayed, setListPlayed] = useState<IPartProgress[]>([]);

    const handleCheckProgress = useCallback(async () => {
        if (subTopic.id) {
            const subTopicProgress = await db.subTopicProgress
                .where("id")
                .equals(subTopic.id)
                .first();

            if (subTopicProgress && subTopicProgress.part) {
                setListPlayed(subTopicProgress.part);
            }
        }
    }, [subTopic.id]);

    useEffect(() => {
        handleCheckProgress();
    }, [subTopic, handleCheckProgress]);

    useEffect(() => {
        if (!isExpand) return;

        const canvas = document.getElementById(
            `lineCanvas-${subTopic.id}`
        ) as HTMLCanvasElement | null;

        if (!canvas) return;

        const ctx: CanvasRenderingContext2DOrNull = canvas.getContext("2d");
        if (!ctx) return;

        const container = document.getElementById(
            `container-${subTopic.id}`
        ) as HTMLDivElement | null;

        if (!container) return;

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const icons =
            document.querySelectorAll<HTMLDivElement>(".iconDrawCanvas");

        ctx.strokeStyle = "#fcb03b";
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        for (let i = 0; i < icons.length - 1; i++) {
            const start = getCenterPosition(icons[i], container);
            const end = getCenterPosition(icons[i + 1], container);
            if (start.y === end.y) {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            } else {
                const position = i % 2 === 0;
                drawCurvedLine(start, end, ctx, position);
            }
        }

        return () => {
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
    }, [subTopic, isExpand]);

    return (
        <div
            className={clsx(
                "w-full  h-full relative bg-[#F3F5F6] py-2 justify-center  rounded-b-md  transition-all ",
                {
                    flex: isExpand,
                    hidden: !isExpand,
                }
            )}
            id={`container-${subTopic.id}`}
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
                                    subTopic={subTopic}
                                    index={i}
                                    key={i}
                                    isCurrentPlaying={listPlayed?.find(
                                        (item) => item.status === 0
                                    )}
                                    isPass={listPlayed
                                        ?.filter((item) => item.status === 1)
                                        ?.map((item) => item.id)
                                        .includes(part.id)}
                                />
                            ))}
                        </div>
                    ))}
            </div>
            <canvas
                id={`lineCanvas-${subTopic.id}`}
                className="absolute w-full h-full top-0 left-0  z-0"
            />
        </div>
    );
};
export default React.memo(TopicLevelProgress);
