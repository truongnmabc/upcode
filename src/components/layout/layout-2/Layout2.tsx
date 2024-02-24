import HeaderV4 from "@/components/header/HeaderV4";
import { IAppInfo } from "@/models/AppInfo";
import { ITopic } from "@/models/Topic";
import React from "react";
import "./Layout2.scss";
import dynamic from "next/dynamic";
import { isParentApp } from "@/config/config_web";
import { ITestInfo } from "@/models/TestInfo";
import { CheckAndAddAds } from "@/components/ads/ads";
const ScrollTopTopArrow = dynamic(() => import("../../v4-material/ScrollToTopArrow"), { ssr: false });
const Footer1 = dynamic(() => import("@/components/footer/Footer1"));
const FooterLandingV4 = dynamic(() => import("@/components/footer/FooterLandingV4"));
const Layout2 = ({
    children,
    appInfo,
    listTopics,
    tests,
    ads = true,
}: {
    children: any;
    appInfo: IAppInfo;
    listTopics: ITopic[];
    tests: ITestInfo[];
    ads?: boolean;
}) => {
    const _isParentApp = isParentApp();
    return (
        <div className="layout-2">
            <HeaderV4 appInfo={appInfo} topics={listTopics} tests={tests} />
            <div className="header-2-frame" />
            {children}
            {_isParentApp ? <Footer1 /> : <FooterLandingV4 appInfo={appInfo} />}
            <ScrollTopTopArrow />
            {ads && <CheckAndAddAds />}
        </div>
    );
};

export default Layout2;
