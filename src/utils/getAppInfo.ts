import { AppInfo } from "@/models/AppInfo";
import fs from "fs";
import path from "path";
let mapAppInfos: any;
const readAllAppInfos = () => {
    if (!mapAppInfos) {
        const directoryAppInfos = path.join(process.cwd(), "src/data/appInfos.json");
        let appInfosData = fs.readFileSync(directoryAppInfos);
        mapAppInfos = JSON.parse(appInfosData.toString());
    }
    let appInfos = mapAppInfos?.map((appInfo: any) => {
        return new AppInfo(appInfo);
    });
    return appInfos;
};
/**
 *
 * @param appId
 * @returns trả ra appInfo hiện tại hoặc theo id được truyền vào
 */
const getAppInfo = (appId?: string) => {
    let mapAppInfos = readAllAppInfos();
    let appInfo = mapAppInfos.find((appInfo: any) => appInfo.appNameId == appId);

    if (!appInfo) {
        appInfo = mapAppInfos.find((appInfo: any) => appInfo.appId == appId);
    }
    // if (isWebDMV() && !appInfo) {
    //     appInfo = mapAppInfos.find(
    //         (appInfo) =>
    //             appInfo.appNameId?.length > 0 &&
    //             appId.includes(appInfo.appNameId)
    //     );
    // }

    // if (!appInfo) {
    //     appInfo = mapAppInfos.find(
    //         (appInfo: IAppInfo) => appInfo.appId === APP_NEW_DOMAIN
    //     );
    // }
    if (appInfo) {
        appInfo = new AppInfo(appInfo);
        // appInfo.id = appInfo.appId;
        appInfo.currentTime = new Date().getTime();
    }
    return appInfo;
};
export { getAppInfo, readAllAppInfos };
