import RouterApp from "@/common/router/router.constant";
import { appInfoState } from "@/redux/features/appInfo";
import { endTest, gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Time = () => {
    const { isPaused, remainTime } = useAppSelector(gameState);
    const { appInfo } = useAppSelector(appInfoState);
    const router = useRouter();
    const [time, setTime] = useState(0);
    const dispatch = useAppDispatch();
    const [isTimeInitialized, setIsTimeInitialized] = useState(false);

    useEffect(() => {
        if (remainTime && !isPaused) {
            setTime(remainTime);
            setIsTimeInitialized(true);
        }
    }, [remainTime, isPaused]);

    useEffect(() => {
        if (time > 0) {
            const timeId = setTimeout(() => {
                setTime((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timeId);
        } else if (time === 0 && isTimeInitialized) {
            console.log("end");
            setIsTimeInitialized(false);

            const _href = revertPathName({
                appName: appInfo.appShortName,
                href: RouterApp.ResultTest,
            });

            dispatch(endTest());

            router.push(_href);
        }
    }, [time, isTimeInitialized, router, appInfo]);

    return <div>{formatTime(time * 1000)}</div>;
};

export default Time;

const formatTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    return (
        <div className="flex items-center  gap-1">
            <div className="text-lg font-medium">
                {hours.toString().padStart(2, "0")}
            </div>
            <span>:</span>
            <div className="text-lg font-medium">
                {minutes.toString().padStart(2, "0")}
            </div>
            <span>:</span>

            <div className="text-lg font-medium">
                {seconds.toString().padStart(2, "0")}
            </div>
        </div>
    );
};
