import { timeCaching } from "@/common/constants";

import path from "path";
import fs from "fs";
import cache from "memory-cache";
import { IAppInfo } from "@/models/app/appInfo";

export const getAppInfoParentApp = () => {
    const cachedAppInfos = cache.get("appInfos");
    if (cachedAppInfos) {
        const appInfo = cachedAppInfos?.find(
            (item: IAppInfo) =>
                item?.appShortName === process.env.APP_SHORT_NAME
        );
        return {
            listApp: cachedAppInfos,
            appInfo: appInfo,
        };
    }

    const directoryAppInfos = path.join(
        process.cwd(),
        "src/data/dynamic/appInfos.json"
    );

    const appInfosData = fs.readFileSync(directoryAppInfos);
    const listApp = JSON.parse(appInfosData.toString());
    const listAppInfo = listApp.filter((w: IAppInfo) => w.appId);

    cache.put("appInfos", listAppInfo, timeCaching);

    const appInfo = listAppInfo?.find(
        (item: IAppInfo) => item?.appShortName === process.env.APP_SHORT_NAME
    );
    return {
        listApp: listAppInfo,
        appInfo: appInfo,
    };
};
