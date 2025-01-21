"use client";
import CountTime from "@/components/countTime";
import ClockIcon from "@/components/icon/ClockIcon";
import RouterApp from "@/constants/router.constant";
import { selectRemainTime } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishCustomTestThunk from "@/redux/repository/game/finish/finishCustomTest";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
const CountTimeCustomTest = () => {
    const dispatch = useAppDispatch();

    const remainTime = useAppSelector(selectRemainTime);
    const router = useRouter();

    const handleEndTime = useCallback(() => {
        dispatch(finishCustomTestThunk());

        router.replace(RouterApp.ResultTest, {
            scroll: true,
        });
    }, [dispatch, router]);
    if (remainTime > 0) {
        return (
            <div className="w-full flex items-center justify-center">
                <div className="flex items-center justify-center w-fit gap-2">
                    <ClockIcon />
                    <CountTime
                        duration={remainTime}
                        onEndTime={handleEndTime}
                    />
                </div>
            </div>
        );
    }

    return null;
};

export default CountTimeCustomTest;
