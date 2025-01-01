"use client";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { addLinkAdsen, checkCountryVN, getAdClientId, hasShowAds } from "./ads";

const AdsProvider = () => {
    const userInfo = useAppSelector(selectUserInfo);

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
                !userInfo.isPro
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

export default AdsProvider;
