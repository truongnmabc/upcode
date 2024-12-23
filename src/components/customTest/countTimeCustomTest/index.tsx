import RouterApp from "@/common/router/router.constant";
import CountTime from "@/components/countTime";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishCustomTestThunk from "@/redux/repository/game/finish/finishCustomTest";
import finishFinalThunk from "@/redux/repository/game/finish/finishFinal";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
const CountTimeCustomTest = () => {
    const dispatch = useAppDispatch();

    const { remainTime } = useAppSelector(gameState);
    const router = useRouter();
    const { appInfo } = useAppSelector(appInfoState);

    const handleEndTime = useCallback(() => {
        dispatch(finishCustomTestThunk());
        const _href = revertPathName({
            href: RouterApp.ResultTest,
            appName: appInfo.appShortName,
        });

        router.replace(_href, {
            scroll: true,
        });
    }, [appInfo.appShortName, dispatch, router]);

    return <CountTime duration={remainTime} onEndTime={handleEndTime} />;
};

export default CountTimeCustomTest;
