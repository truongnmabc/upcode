"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/redux/store";
import { setAppInfo } from "@/redux/features/appInfo";
import { IAppConfigData, setAppConfig } from "@/redux/features/appConfig";
import { IAppInfo } from "@/models/app/appInfo";

export default function StoreProvider({
    children,
    appInfo,
    appConfig,
}: {
    children: React.ReactNode;
    appInfo: IAppInfo;
    appConfig: IAppConfigData;
}) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        storeRef.current = makeStore();
        storeRef.current.dispatch(setAppInfo(appInfo));
        storeRef.current.dispatch(setAppConfig(appConfig));
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
