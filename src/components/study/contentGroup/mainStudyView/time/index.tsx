import ClockIcon from "@/components/icon/ClockIcon";
import { useSearchParams } from "next/navigation";
import React from "react";
import Time from "./time";

const TimeTest = () => {
    const type = useSearchParams().get("type");
    if (type === "test") {
        return (
            <div className="w-full flex items-center justify-center">
                <div className="flex items-center justify-center w-fit gap-2">
                    <ClockIcon />
                    <Time />
                </div>
            </div>
        );
    }
    return <></>;
};

export default React.memo(TimeTest);
