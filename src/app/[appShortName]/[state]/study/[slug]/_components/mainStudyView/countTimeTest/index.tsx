import RouterApp from "@/router/router.constant";
import CountTime from "@/components/countTime";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishPracticeThunk from "@/redux/repository/game/finish/finishPracticeTest";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

const CountTimeRemainPracticeTest = () => {
    const dispatch = useAppDispatch();

    const { remainTime } = useAppSelector(gameState);
    const router = useRouter();
    const { appInfo } = useAppSelector(appInfoState);

    const handleEndTime = useCallback(() => {
        dispatch(finishPracticeThunk());
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

export default React.memo(CountTimeRemainPracticeTest);
