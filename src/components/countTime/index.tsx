import React, { useEffect, useState } from "react";

type IProps = {
    onEndTime: () => void;
    duration: number;
};
const CountTime: React.FC<IProps> = ({ onEndTime, duration }) => {
    const [time, setTime] = useState(-1);

    useEffect(() => {
        if (duration > 0) {
            setTime(duration);
        }
    }, [duration]);

    useEffect(() => {
        if (time > 0) {
            const timeId = setTimeout(() => {
                setTime((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timeId);
        } else if (time === 0) {
            setTime(-1);
            onEndTime();
        }
    }, [time, onEndTime]);

    return <div>{formatTime(time * 1000)}</div>;
};

export default React.memo(CountTime);

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
