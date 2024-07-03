import Config from "../../config";
import { callApi } from "../../services";

export const sendEmailApi = (data) => {
    return callApi({
        baseURl: Config.BASE_URL,
        method: "get",
        url: `/api/auth?type=send-email&email=${data.email}&appName=${data.appName}`,
        params: data,
        headers: null,
    });
};

export const verifiedCodeApi = (data) => {
    return callApi({
        baseURl: Config.BASE_URL,
        method: "get",
        url: `/api/auth?type=verify-code&email=${data.email}&code=${data.code}`,
        params: data,
        headers: null,
    });
};
