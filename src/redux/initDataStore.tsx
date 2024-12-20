"use client";
import { IAppInfo } from "@/models/app/appInfo";
import React from "react";
import {
    appConfigState,
    IAppConfigData,
    setAppConfig,
} from "./features/appConfig";
import { appInfoState, setAppInfo } from "./features/appInfo";
import { useAppDispatch, useAppSelector } from "./hooks";
import InitData from "@/components/initData";

const InitDataStore = ({
    appConfig,
    appInfo,
}: {
    appInfo: IAppInfo;
    appConfig: IAppConfigData;
}) => {
    const dispatch = useAppDispatch();
    const { appInfo: currentAppInfo } = useAppSelector(appInfoState);
    const { appConfig: currentAppConfig } = useAppSelector(appConfigState);

    if (appInfo.appId !== currentAppInfo.appId) {
        dispatch(setAppInfo(appInfo));
    }
    if (appConfig.appId !== currentAppConfig.appId) {
        dispatch(setAppConfig(appConfig));
    }
    return <></>;
};

export default React.memo(InitDataStore);
