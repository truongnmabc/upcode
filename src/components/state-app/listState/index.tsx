"use client";
import { IAppInfo } from "@/models/app/appInfo";
import React, { useEffect, useState } from "react";
import ListState from "./listState";

const BtnGotoState = ({ appInfo }: { appInfo: IAppInfo }) => {
    const [currentState, setCurrentState] = useState("");
    const [openListState, setOpenListState] = useState(false);

    useEffect(() => {
        const _state = localStorage.getItem(
            "select-state-" + appInfo.appNameId
        );
        if (_state) {
            setCurrentState(_state);
        }
    }, [appInfo]);
    return (
        <div className="w-full sm:pt-12 pt-6 flex justify-center flex-col items-center">
            <div
                className="bg-[#212121f5] py-3 px-8 font-semibold text-2xl text-white capitalize text-center rounded-md cursor-pointer "
                onClick={() => {
                    // if (currentState) {
                    //     window.location.href = getLink(appInfo, currentState);
                    //     ga.event({
                    //         action: "click_go_to_state",
                    //         params: { app: appInfo.appName },
                    //     });
                    // } else {
                    //     if (openListState != 1) setOpenListState(1);
                    //     ga.event({
                    //         action: "click_get_started",
                    //         params: { app: appInfo.appName },
                    //     });
                    // }
                    setOpenListState(true);
                }}
            >
                {currentState
                    ? `Go To ${currentState.replaceAll("-", " ")}`
                    : "Get Started"}
            </div>

            {!!currentState && (
                <div
                    className="text-center font-normal text-sm mt-6 "
                    onClick={() => {
                        setOpenListState(true);
                        // ga.event({
                        //     action: "select_another_state",
                        //     params: { app: appInfo.appName },
                        // });
                    }}
                >
                    Not your state?
                </div>
            )}
            <ListState
                appInfo={appInfo}
                openListState={openListState}
                setOpenListState={setOpenListState}
            />
        </div>
    );
};

export default BtnGotoState;
