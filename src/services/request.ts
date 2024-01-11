import Axios from "axios";
import Config from "../config/index";

export class RequestData {
    url: string;
    params: any;

    constructor(url: string, params: any) {
        this.url = url;
        this.params = params;
    }
}

export const GET: any = (data: RequestData) => {
    return new Promise((resolve, reject) => {
        Axios({
            timeout: Config.HTTP_REQUEST_TIMEOUT,
            url: data.url,
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((response) => {
                if (response.status === Config.HTTP_REQUEST_SUCCESS) {
                    resolve(response.data);
                } else {
                    reject(response.status);
                }
            })
            .catch((e) => reject(e));
    });
};
export const POST: any = (data: RequestData) => {
    return new Promise((resolve, reject) => {
        Axios({
            timeout: Config.HTTP_REQUEST_TIMEOUT,
            url: data.url,
            headers: { "Content-Type": "application/json" },
            method: "POST",
            data: data.params,
        })
            .then((response) => {
                if (response.status === Config.HTTP_REQUEST_SUCCESS) {
                    resolve(response.data);
                } else {
                    reject(response.status);
                }
            })
            .catch((e) => reject(e));
    });
};
