import Footer1 from "@/components/footer/Footer1";
import Header1 from "@/components/header/Header1";
import { IAppInfo } from "@/models/AppInfo";
import React from "react";
import "./Layout1.scss";
const Layout1 = ({ children, listAppInfos }: { children: any; listAppInfos: IAppInfo[] }) => {
    return (
        <div className="layout-1">
            <Header1 listAppInfos={listAppInfos} />
            <div className="header-1-frame" />
            {children}
            <Footer1 />
        </div>
    );
};

export default Layout1;
