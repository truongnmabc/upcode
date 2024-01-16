import { APP_SHORT_NAME } from "../config_app";
export const IOS_STORE_PATH = "app-ios";
export const ANDROID_STORE_PATH = "app-android";

export const isWebPASSEMALL = () => {
    return APP_SHORT_NAME.toLowerCase() == "passemall";
};

export const isWebEASYPREP = () => {
    return APP_SHORT_NAME.toLowerCase() == "easyprep";
};

export const isWebASVAB = () => {
    return APP_SHORT_NAME.toLowerCase() == "asvab";
};

export function setSession(key: string, value: string) {
    if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(key, value);
    }
}

export function getSession(key: string) {
    if (typeof sessionStorage !== "undefined") {
        return sessionStorage.getItem(key);
    }
    return "";
}

export const isProduction = () => {
    return process.env.NEXT_PUBLIC_WEB_PROD == "production";
};

export const isParentApp = () => {
    return isWebPASSEMALL() || isWebEASYPREP();
};
