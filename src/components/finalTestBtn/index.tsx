"use client";

import { MtUiButton } from "@/components/button";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React from "react";

const FN = () => {
    const appInfo = useAppSelector(selectAppInfo);
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
                <span className="text-base  font-semibold text-white uppercase">
                    {appInfo.appShortName}
                </span>{" "}
                Final Test
            </p>
        </MtUiButton>
    );
};
const FinalTestBtn = React.memo(FN);
export default FinalTestBtn;
