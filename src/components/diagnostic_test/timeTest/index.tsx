import ClockIcon from "@/components/icon/ClockIcon";
import LazyLoadImage from "@/components/images";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import CountTimeDiagnostic from "../countTimeRemain";
import Rating from "@mui/material/Rating";
const TimeTestGetLever = () => {
    const { currentGame } = useAppSelector(gameState);

    return (
        <div className="w-full bg-[#F0F4F9] px-3 py-[14px] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-1">
                <LazyLoadImage
                    classNames="w-6 h-6"
                    src="/images/notebook-dynamic-color.png"
                />
                <p className=" capitalize text-sm font-medium">
                    {currentGame?.tag?.replaceAll("-", " ")}
                </p>
            </div>
            <div className="flex items-center justify-center w-fit gap-2">
                <ClockIcon />
                <CountTimeDiagnostic />
            </div>
            <div className="px-2 py-1 flex items-center rounded-lg bg-[#FCFCFC]">
                <p className="text-sm text-[#21212185]  font-medium pr-1">
                    Level
                </p>

                <Rating
                    name="read-only"
                    value={
                        currentGame?.level === -1
                            ? 2
                            : currentGame?.level < 50
                            ? 1
                            : 3
                    }
                    max={3}
                    readOnly
                />
                {/* <IconStarLevel
                    level={
                        currentGame?.level === -1
                            ? 2
                            : currentGame?.level < 50
                            ? 1
                            : 3
                    }
                    defaultLevel={1}
                />
                <IconStarLevel
                    level={
                        currentGame?.level === -1
                            ? 2
                            : currentGame?.level < 50
                            ? 1
                            : 3
                    }
                    defaultLevel={2}
                />
                <IconStarLevel
                    level={
                        currentGame?.level === -1
                            ? 2
                            : currentGame?.level < 50
                            ? 1
                            : 3
                    }
                    defaultLevel={3}
                /> */}
            </div>
        </div>
    );
};

export default React.memo(TimeTestGetLever);

const IconStarLevel = ({
    level,
    defaultLevel,
}: {
    level: number;
    defaultLevel: number;
}) => {
    const isActive = level >= defaultLevel && level > 0;
    console.log("🚀 ~ isActive:", isActive);

    return (
        <LazyLoadImage
            classNames="w-6 h-6"
            src={
                isActive
                    ? "/images/rate/star-dynamic-color.png"
                    : "/images/rate/star-dynamic-color-1.png"
            }
        />
    );
};
