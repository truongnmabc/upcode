import { timeCaching } from "@/common/constants";

import path from "path";
import fs from "fs";
import cache from "memory-cache";
import { IAppInfo } from "@/models/app/appInfo";
import { IAppConfigData } from "@/redux/features/appConfig";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
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

export async function fetchAppData(
    appShortName: string,
    fetchAll = false
): Promise<{
    appInfo?: IAppInfo | null;
    appConfig?: IAppConfigData;
}> {
    try {
        const { data: appInfo } = await axiosInstance.get(
            `${API_PATH.APP_INFO}/${appShortName}`
        );

        if (!appInfo || appInfo.code === 404) {
            return { appInfo: null, appConfig: undefined };
        }

        let appConfig;
        if (fetchAll) {
            const { data: configData } = await axiosInstance.get(
                `${API_PATH.APP_CONFIG}/${appInfo.data?.appShortName}`
            );
            appConfig = configData?.data;
        }

        return { appInfo: appInfo.data, appConfig };
    } catch (error) {
        console.error("Failed to fetch app data:", error);
        return { appInfo: null, appConfig: undefined };
    }
}
