import ClockIcon from "@/components/icon/ClockIcon";
import LazyLoadImage from "@/components/images";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import CountTimeDiagnostic from "../countTimeRemain";
import Rating from "@mui/material/Rating";

import { styled } from "@mui/material/styles";

const CustomRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty svg": {
        color: "#21212133", // Màu nền khi không active
    },
    "& .MuiRating-iconFilled": {
        color: theme.palette.primary.main, // Màu primary khi active
    },
    "& .MuiRating-iconHover": {
        color: theme.palette.primary.light, // Màu sáng hơn khi hover
    },
}));

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

                <CustomRating
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
            </div>
        </div>
    );
};

export default React.memo(TimeTestGetLever);
