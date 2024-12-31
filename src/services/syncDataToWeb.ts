import { callApi } from ".";
import APIConfig from "../config/api_config";
import { getSession, isProduction } from "../config/config_web";
import Config from "@/config";
const SYNC_DEV_VALUE = getSession(Config.TESTER_KEY);
export const SYNC_DEV_MODE = !isProduction() ? true : SYNC_DEV_VALUE;

const BASE_URL = isProduction() ? null : Config.BASE_URL_DEV;

export function uploadUserStudyPlanAPI(data: any) {
    return callApi({
        baseURl: BASE_URL,
        method: "post",
        url: "/api/auth?type=update-study-plan",
        params: data,
        headers: undefined,
    });
}

export const uploadPaymentInfoAPI = (object: any, k?: number) => {
    return callApi({
        baseURl: BASE_URL,
        method: "post",
        url: APIConfig.SAVE_PAYMENT_INFO,
        params: object,
        headers: undefined,
    });
};

export const saveToDashboardAPI = (object) => {
    return callApi({
        baseURl: "https://dashboard-api2.abc-elearning.org/",
        method: "post",
        url: "pro-purchase-events/",
        params: object,
        headers: undefined,
    });
};
