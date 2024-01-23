import FooterLandingV4 from "@/components/footer/FooterLandingV4";
import HeaderV4 from "@/components/header/HeaderV4";
import { IAppInfo } from "@/models/AppInfo";
import { ITopic } from "@/models/Topic";
import React from "react";
import "./Layout2.scss";
import dynamic from "next/dynamic";
const ScrollTopTopArrow = dynamic(() => import("../../v4-material/ScrollToTopArrow"), { ssr: false });
const Layout2 = ({ children, appInfo, listTopics }: { children: any; appInfo: IAppInfo; listTopics: ITopic[] }) => {
    return (
        <div className="layout-2">
            <HeaderV4 appInfo={appInfo} topics={listTopics} />
            <div className="header-2-frame" />
            {children}
            <FooterLandingV4 appInfo={appInfo} />
            <ScrollTopTopArrow />
        </div>
    );
};

export default Layout2;
