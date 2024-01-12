import Footer1 from "@/components/footer/Footer1";
import Header1 from "@/components/header/Header1";
import { IAppInfo } from "@/models/AppInfo";
import React from "react";

const Layout1 = ({ children, listAppInfos }: { children: any; listAppInfos: IAppInfo[] }) => {
    return (
        <>
            <Header1 listAppInfos={listAppInfos} />
            {children}
            <Footer1 />
        </>
    );
};

export default Layout1;
