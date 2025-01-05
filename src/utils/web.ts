export const IOS_STORE_PATH = "app-ios";
export const ANDROID_STORE_PATH = "app-android";

const appTypeMap: Record<string, "parent" | "default" | "state"> = {
    passemall: "parent",
    easyprep: "parent",
    asvab: "default",
    dmv: "state",
    cdl: "state",
    cdl_v2: "default",
};

export const getAppType = (appName: string): "parent" | "default" | "state" => {
    const normalizedAppName = appName.toLowerCase();
    return appTypeMap[normalizedAppName] || "default";
};
