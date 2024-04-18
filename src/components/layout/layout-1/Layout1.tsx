import Footer1 from "@/components/footer/Footer1";
import Header1 from "@/components/header/Header1";
import { IAppInfo } from "@/models/AppInfo";
import React from "react";
import dynamic from "next/dynamic";
const ScrollTopTopArrow = dynamic(() => import("../../v4-material/ScrollToTopArrow"), { ssr: false });
import "./Layout1.scss";
const Layout1 = ({ children, listAppInfos, ads = true }: { children: any; listAppInfos: IAppInfo[]; ads?: boolean }) => {
    return (
        <div className="layout-1">
            <Header1 listAppInfos={listAppInfos} />
            {children}
            <Footer1 />
            <ScrollTopTopArrow />
        </div>
    );
};

export default Layout1;
