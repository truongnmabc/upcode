import Config from "@/common/config";
import Axios, { AxiosRequestConfig } from "axios";

export const request = async (config: AxiosRequestConfig) => {
  try {
    const response = await Axios({
      baseURL: Config.BASE_URL,
      timeout: Config.HTTP_REQUEST_TIMEOUT,
      ...config,
    });
    if (response.status === Config.HTTP_REQUEST_SUCCESS) {
      return response.data;
    } else {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const requestGetData = async ({
  url,
  params,
  config,
}: {
  url: string;
  params?: any;
  config?: any;
}) => {
  return request({
    url,
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    params,
    ...config,
  });
};

export const requestPostData = async ({
  url,
  data,
  config,
}: {
  url: string;
  data?: any;
  config?: any;
}) => {
  return request({
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    ...config,
  });
};
