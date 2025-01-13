"use client";
import CountTime from "@/components/countTime";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishCustomTestThunk from "@/redux/repository/game/finish/finishCustomTest";
import RouterApp from "@/router/router.constant";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
const CountTimeCustomTest = () => {
    const dispatch = useAppDispatch();

    const { remainTime } = useAppSelector(gameState);
    const router = useRouter();

    const handleEndTime = useCallback(() => {
        dispatch(finishCustomTestThunk());

        router.replace(RouterApp.ResultTest, {
            scroll: true,
        });
    }, [dispatch, router]);

    return <CountTime duration={remainTime} onEndTime={handleEndTime} />;
};

export default CountTimeCustomTest;
