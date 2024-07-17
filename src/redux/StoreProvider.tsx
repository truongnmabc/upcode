import { IAppInfo } from "@/models/AppInfo";
import IWebData from "@/types/webData";
import React, { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { setAppInfo } from "./features/appInfo";
import { getTestSuccess } from "./features/test";
import { getTopicByParentIdSuccess } from "./features/topic";
import { getStudyData } from "./reporsitory/game.repository";
import { getUserDeviceLogin } from "./reporsitory/syncData.repository";
import PopupSubscription from "@/components/pro/check-subscription/PopupSubscription";
import CheckAdsBlocker from "@/components/pro/CheckAdsBlocker";
import AppState from "./appState";
import { addLinkAdsen, checkCountryVN, getAdClientId, hasShowAds } from "@/components/ads/ads";
import GoogleAuth from "@/components/google-button";

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
    const isPro = useSelector((state: AppState) => state.userReducer.isPro);
    useEffect(() => {
        dispatch(setAppInfo(appInfo));
        if (!!webData.tests) {
            dispatch(getTestSuccess(webData.tests));
        }
        if (!!webData.topics) {
            dispatch(getTopicByParentIdSuccess(webData.topics)); // chỉ là để update vào redux thôi
        }
        if (!!webData.type) dispatch(getStudyData(webData));

        dispatch(getUserDeviceLogin(appInfo));
    }, []);
    return (
        <>
            {children}
            <PopupSubscription appInfo={appInfo} />
            <CheckAdsBlocker upgradedPro={isPro} webData={webData} />
            <CheckAndAddAds isProUser={isPro} />
            <GoogleOneTapLogin />
        </>
    );
};

const CheckAndAddAds = ({ isProUser }: { isProUser: boolean }) => {
    useEffect(() => {
        let adClient = getAdClientId();
        if (!adClient?.length) {
            return;
        }
        const src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"; // add script ở đây (không add ở _document hay SeaoHeader/SEO) và các component chỉ việc sd luôn thôi
        try {
            if (addLinkAdsen() && !checkCountryVN() && hasShowAds() && !isProUser) {
                const elements = document.getElementsByTagName("script");
                let hasScript = false;
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i]?.src && elements[i].src == src) {
                        hasScript = true;
                    }
                }
                if (!hasScript) {
                    const elem = document.createElement("script");
                    elem.setAttribute("data-ad-client", getAdClientId());
                    elem.src = src;
                    elem.async = true;
                    elem.defer = true;
                    document.body.insertBefore(elem, document.body.firstChild);
                }
            }
        } catch (e) {
            console.log("CheckAndAddAds:", e);
        }
    }, []);
    return null;
};

const GoogleOneTapLogin = () => {
    ///// one tap login with google
    const userInfo = useSelector((state: AppState) => state.userReducer.userInfo);
    const loading = useSelector((state: AppState) => state.userReducer.loading);
    return typeof window !== "undefined" && !loading && !userInfo?.email && <GoogleAuth isRenderButton={false}></GoogleAuth>;
};
