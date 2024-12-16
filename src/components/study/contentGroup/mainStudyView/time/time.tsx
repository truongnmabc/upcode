import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";

const Time = () => {
    const { time: timeTest } = useAppSelector(gameState);

    const [time, setTime] = useState(0);

    useEffect(() => {
        if (timeTest) {
            const timeLocal = localStorage.getItem("timeLocal");
            if (timeLocal) {
                const startTime = JSON.parse(timeLocal);
                const currentTime = new Date().getTime();

                const elapsedSeconds = Math.floor(
                    (currentTime - startTime) / 1000
                );

                const remainingTime = timeTest * 60 - elapsedSeconds;

                if (remainingTime <= 0) {
                    setTime(0);
                } else {
                    setTime(remainingTime);
                }
            } else {
                const startTime = new Date().getTime();
                localStorage.setItem("timeLocal", JSON.stringify(startTime));
                setTime(timeTest * 60);
            }
        }
    }, [timeTest]);

    useEffect(() => {
        if (time > 0) {
            const timeId = setTimeout(() => {
                setTime((prev) => prev - 1);
            }, 1000);
            return () => {
                clearTimeout(timeId);
            };
        }
    }, [time]);
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
