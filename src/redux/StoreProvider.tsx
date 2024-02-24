import { IAppInfo } from "@/models/AppInfo";
import IWebData from "@/types/webData";
import React, { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { setAppInfo } from "./features/appInfo";
import { getTestSuccess } from "./features/test";
import { getTopicByParentIdSuccess } from "./features/topic";
import { getStudyData } from "./reporsitory/game.repository";
import { CheckAndAddAds } from "@/components/ads/ads";

/**
// những action nào phải gọi ngay khi vào trang thì phải gọi ở trong này mới có tác dụng (vì persist đc khởi tạo ở client), gọi trong này để persist/HYDRATE được gọi đầu tiên rồi mới đến các action khác
 */
export default function StoreProvider({
    children,
    appInfo,
    webData,
}: {
    children?: React.ReactNode;
    appInfo: IAppInfo;
    webData?: IWebData;
}) {
    const store: any = useStore();
    if (!!store.__persistor) {
        return (
            <PersistGate persistor={store.__persistor}>
                <MyProvider appInfo={appInfo} webData={webData}>
                    {children}
                </MyProvider>
            </PersistGate>
        );
    }
    return <>{children}</>;
}

const MyProvider = ({ children, appInfo, webData }: { children?: React.ReactNode; appInfo: IAppInfo; webData?: IWebData }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setAppInfo(appInfo));
        if (!!webData.type) dispatch(getStudyData(webData));
        if (!!webData.tests) dispatch(getTestSuccess(webData.tests));
        if (!!webData.topics) dispatch(getTopicByParentIdSuccess(webData.topics)); // chỉ là để update vào redux thôi
    }, []);
    return (
        <>
            {children}
            <CheckAndAddAds />
        </>
    );
};
