"use client";

import { MtUiButton } from "@/components/button";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import { useRouter } from "next/navigation";
import React from "react";

const FinalTestBtn = () => {
    const appInfo = useAppSelector(selectAppInfo);
    const dispatch = useAppDispatch();

    const router = useRouter();

    return (
        <MtUiButton
            block
            type="primary"
            onClick={() => {
                dispatch(initFinalTestThunk());

                router.replace("/final_test");
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
export default React.memo(FinalTestBtn);
