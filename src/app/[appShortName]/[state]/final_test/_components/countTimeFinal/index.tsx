import CountTime from "@/components/countTime";
import {
    selectIsPaused,
    selectRemainTime,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishFinalThunk from "@/redux/repository/game/finish/finishFinal";
import RouterApp from "@/constants/router.constant";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const CountTimeFinalTest = () => {
    const dispatch = useAppDispatch();

    const remainTime = useAppSelector(selectRemainTime);
    const isPause = useAppSelector(selectIsPaused);
    const router = useRouter();

    const handleEndTime = useCallback(() => {
        dispatch(finishFinalThunk());

        router.replace(RouterApp.ResultTest, {
            scroll: true,
        });
    }, [dispatch, router]);

    return (
        <CountTime
            isPause={isPause}
            duration={remainTime}
            onEndTime={handleEndTime}
        />
    );
};

export default CountTimeFinalTest;
