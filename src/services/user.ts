import { callApi } from ".";
import Config from "../config";

export const saveUserInfoDashboard = (args: {
    email: string;
    appShortName: string;
    hourUTC: number;
    isBuy: boolean;
    appId: number;
    isSetupStudyPlan: boolean;
    testDate: string;
}) => {
    return callApi({
        method: "POST",
        baseURl: Config.DASHBOARD_API,
        url: "web-login",
        params: args,
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
    return callApi({
        method: "POST",
        baseURl: Config.DASHBOARD_API,
        url: "buy-pro",
        params: args,
    });
};
