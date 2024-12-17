import ParentAppLayoutV0 from "@/components/parent-app/passemail/ParentAppLayoutV0";
import { getAppInfoParentApp } from "@/utils/getAppInfos";
import replaceYear from "@/utils/replaceYear";
import React from "react";

const ParentAppPage = async () => {
    const { listApp, appInfo } = getAppInfoParentApp();

    if (appInfo) {
        return (
            <ParentAppLayoutV0
                appInfo={appInfo}
                descriptionSEO={appInfo.descriptionSEO}
                listAppInfo={listApp}
                titleSEO={replaceYear(appInfo.title)}
            />
        );
    }
    return <></>;
};

export default ParentAppPage;
