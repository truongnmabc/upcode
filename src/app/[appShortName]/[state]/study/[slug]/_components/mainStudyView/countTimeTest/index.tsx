import CountTime from "@/components/countTime";
import { shouldEndTimeTest } from "@/redux/features/game";
import { selectRemainTime } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishPracticeThunk from "@/redux/repository/game/finish/finishPracticeTest";
import RouterApp from "@/router/router.constant";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

const CountTimeRemainPracticeTest = () => {
    const dispatch = useAppDispatch();

    const remainTime = useAppSelector(selectRemainTime);
    const router = useRouter();

    const handleEndTime = useCallback(() => {
        dispatch(finishPracticeThunk());
        dispatch(shouldEndTimeTest(true));

        router.replace(RouterApp.ResultTest, {
            scroll: true,
        });
    }, [dispatch, router]);

    return <CountTime duration={remainTime} onEndTime={handleEndTime} />;
};

export default React.memo(CountTimeRemainPracticeTest);
