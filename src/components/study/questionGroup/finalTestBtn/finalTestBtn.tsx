"use client";

import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React from "react";

const FN = () => {
    const { appInfo } = useAppSelector(appInfoState);
    const dispatch = useAppDispatch();

    const path = revertPathName({
        href: `/final_test`,
        appName: appInfo.appShortName,
    });

    const router = useRouter();

    return (
        <MtUiButton
            block
            type="primary"
            onClick={() => {
                dispatch(initFinalTestThunk());

                router.replace(path);
            }}
        >
            <p className="text-base capitalize font-semibold text-white">
                {appInfo.appShortName} Final Test
            </p>
        </MtUiButton>
    );
};
const FinalTestBtn = React.memo(FN);
export default FinalTestBtn;
