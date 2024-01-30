import { isWebDMV } from "@/config/config_web";
import { AppInfo } from "@/models/AppInfo";
import fs from "fs";
import path from "path";
let mapAppInfos;
const readAllAppInfos = () => {
    if (!mapAppInfos) {
        const directoryAppInfos = path.join(process.cwd(), "src/data/appInfos.json");
        let appInfosData = fs.readFileSync(directoryAppInfos);
        mapAppInfos = JSON.parse(appInfosData.toString());
    }
    let appInfos = mapAppInfos?.map((appInfo) => {
        return new AppInfo(appInfo);
    });
    return appInfos;
};
/**
 *
 * @param appId
 * @returns trả ra appInfo hiện tại hoặc theo id được truyền vào
 */
const getAppInfo = (appId = "") => {
    let mapAppInfos = readAllAppInfos();
    let appInfo = mapAppInfos.find((appInfo) => appInfo.appNameId == appId);
    if (!appInfo) {
        appInfo = mapAppInfos.find((appInfo) => appInfo.appId == appId);
    }
    if (isWebDMV() && !appInfo) {
        appId = APP_NEW_DOMAIN + "";
        appInfo = mapAppInfos.find((appInfo) => appInfo.appNameId?.length > 0 && appId.includes(appInfo.appNameId));
    }

    if (!appInfo) {
        appInfo = mapAppInfos.find((appInfo) => appInfo.appId === APP_NEW_DOMAIN);
    }
    if (appInfo) {
        appInfo = new AppInfo(appInfo);
        appInfo.id = appInfo.appId;
    }
    return appInfo;
};
export { getAppInfo, readAllAppInfos };
