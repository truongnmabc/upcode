import React, { useEffect } from "react";
import Time from "@/components/study/contentGroup/mainStudyView/time/time";
import ClockIcon from "@/components/icon/ClockIcon";
import LazyLoadImage from "@/components/images";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";

const TimeTestGetLever = () => {
    const { currentGame } = useAppSelector(gameState);

    useEffect(() => {
        console.log("🚀 ~ useEffect ~ currentGame:", currentGame);
    }, [currentGame]);
    return (
        <div className="w-full bg-[#F0F4F9] px-3 py-[14px] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-1">
                <LazyLoadImage
                    classNames="w-6 h-6"
                    src="/images/notebook-dynamic-color.png"
                />
                <p className=" capitalize text-sm font-medium">
                    Arithmetic Reasoning
                </p>
            </div>
            <div className="flex items-center justify-center w-fit gap-2">
                <ClockIcon />
                <Time />
            </div>
            <div className="px-2 py-1 flex items-center rounded-lg bg-[#FCFCFC]">
                <p className="text-sm text-[#21212185]  font-medium pr-1">
                    Level
                </p>
                <IconStarLevel level={1} defaultLevel={1} />
                <IconStarLevel level={1} defaultLevel={2} />
                <IconStarLevel level={1} defaultLevel={3} />
            </div>
        </div>
    );
};

export default TimeTestGetLever;

const IconStarLevel = ({
    level,
    defaultLevel,
}: {
    level: number;
    defaultLevel: number;
}) => {
    if (level >= defaultLevel) {
        return (
            <LazyLoadImage
                classNames="w-6 h-6"
                src="/images/rate/star-dynamic-color.png"
            />
        );
    } else {
        return (
            <LazyLoadImage
                classNames="w-6 h-6"
                src="/images/rate/star-dynamic-color-1.png"
            />
        );
    }
};
