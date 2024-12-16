import Config from "../config";
import { requestPostData } from "./request";

export const saveUserInfoDashboard = (args: {
    email: string;
    appShortName: string;
    hourUTC: number;
    isBuy: boolean;
    appId: number;
    isSetupStudyPlan: boolean;
    testDate: string;
}) => {
    return requestPostData({
        url: "web-login",
        data: args,
        config: {
            baseURL: Config.DASHBOARD_API,
        },
    });
};
export const updateUserInfoDashboard = (args: {
    email: string;
    appShortName: string;
    appId: string;
    isBuy?: boolean;
    isSetupStudyPlan?: boolean;
    testDate?: string;
}) => {
    return requestPostData({
        config: {
            baseURL: Config.DASHBOARD_API,
        },
        url: "buy-pro",
        data: args,
    });
};

export function syncDataToWebAfterLoginAPI(data: any) {
    //https://micro-enigma-235001.appspot.com/api/auth?type=send-email&email=tranhoang30101@gmail.com&appName=ASVAB
    return requestPostData({
        url: "/api/auth?type=sync-data-to-web-after-login",
        data,
        config: {
            baseURL: Config.BASE_URL,
        },
    });
}
