import { IAppInfo } from "@/models/AppInfo";
import React from "react";
import Layout1 from "../layout/layout-1/Layout1";

const ParentAppLayout = ({ appInfo, listAppInfos }: { appInfo: IAppInfo; listAppInfos: IAppInfo[] }) => {
    return (
        <div>
            <Layout1>ParentAppLayout</Layout1>
        </div>
    );
};

export default ParentAppLayout;
