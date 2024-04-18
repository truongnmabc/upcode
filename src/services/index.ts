import Config from "@/config";
import Axios, { Method } from "axios";
const callApi = ({
    method,
    url,
    params,
    baseURl,
    headers,
    timeout,
}: {
    method: Method;
    url: string;
    params: any;
    baseURl?: string;
    headers?: any;
    timeout?: number;
}): any => {
    return new Promise((resolve, reject) => {
        return Axios({
            baseURL: baseURl ? baseURl : Config.BASE_URL,
            timeout: timeout ?? Config.HTTP_REQUEST_TIMEOUT,
            url: url,
            method: method ? method : "POST",
            data: params ? params : null,
            headers,
        })
            .then((response) => {
                if (response.status === Config.HTTP_REQUEST_SUCCESS) {
                    resolve(response.data);
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
};

export { callApi };
