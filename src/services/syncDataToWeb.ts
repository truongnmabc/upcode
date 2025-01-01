import { callApi } from ".";
import APIConfig from "../config/api_config";
import { getSession } from "../config/config_web";
import Config from "@/config";
import { requestPostData } from "./request";
import { isProduction } from "@/common/constants";

const SYNC_DEV_VALUE = getSession(Config.TESTER_KEY);
export const SYNC_DEV_MODE = !isProduction ? true : SYNC_DEV_VALUE;

const BASE_URL = isProduction ? "" : Config.BASE_URL_DEV;

export function uploadUserStudyPlanAPI(data: any) {
    return requestPostData({
        url: "/api/auth?type=update-study-plan",
        data: data,
        config: {
            baseURL: BASE_URL,
        },
    });
}

export const uploadPaymentInfoAPI = (object: any, k?: number) => {
    return requestPostData({
        url: APIConfig.SAVE_PAYMENT_INFO,
        data: object,
        config: {
            baseURL: BASE_URL,
        },
    });
};

export const saveToDashboardAPI = (object) => {
    return requestPostData({
        url: "pro-purchase-events/",
        data: object,
        config: {
            baseURL: "https://dashboard-api2.abc-elearning.org/",
        },
    });
};
