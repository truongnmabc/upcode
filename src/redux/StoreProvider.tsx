import { IAppInfo } from "@/models/AppInfo";
import IWebData from "@/types/webData";
import React, { useEffect } from "react";

import { getStudyData } from "./reporsitory/game.repository";
import { getUserDeviceLogin } from "./reporsitory/syncData.repository";
import PopupSubscription from "@/components/pro/check-subscription/PopupSubscription";
import CheckAdsBlocker from "@/components/pro/CheckAdsBlocker";
import {
    addLinkAdsen,
    checkCountryVN,
    getAdClientId,
    hasShowAds,
} from "@/components/ads/ads";
import GoogleAuth from "@/components/google-button";
import { useAppDispatch, useAppSelector } from "./hooks";
import { userState } from "./features/user";

const MyProvider = ({
    appInfo,
    webData,
}: {
    appInfo: IAppInfo;
    webData?: IWebData;
}) => {
    const dispatch = useAppDispatch();
    const { isPro } = useAppSelector(userState);
    useEffect(() => {
        dispatch(getUserDeviceLogin(appInfo));
    }, []);
    return (
        <>
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
        const src =
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"; // add script ở đây (không add ở _document hay SeaoHeader/SEO) và các component chỉ việc sd luôn thôi
        try {
            if (
                addLinkAdsen() &&
                !checkCountryVN() &&
                hasShowAds() &&
                !isProUser
            ) {
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
    const { userInfo } = useAppSelector(userState);
    return (
        typeof window !== "undefined" &&
        !userInfo?.email && <GoogleAuth isRenderButton={false}></GoogleAuth>
    );
};
