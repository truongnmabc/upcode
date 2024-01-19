import cache from "memory-cache";
import APIConfig from "@/config/api_config";
import Config from "../config";
import { GET, POST } from "./request";
import { isProduction, isWebCDL } from "@/config/config_web";

export const END_POINT_WORD_PRESS =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.length && process.env.NEXT_PUBLIC_WORDPRESS_API_URL != "null"
        ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL
        : null;
export const API_SEND_EMAIL = "https://webpush.passemall.com/api/send-contact";

export const getHomeSeoContentApi = async (postUrl: string) => {
    if (!END_POINT_WORD_PRESS?.length) {
        return "";
    }
    let url = END_POINT_WORD_PRESS + Config.PREFIX_URL + APIConfig.GET_HOME_SEO_CONTENT + "?posturl=" + postUrl;
    let content = await GET({ url });
    return content;
};

// export const getAppRatingReviewForWeb = async (appKey: string) => {
//     //http://localhost:3001/api/app-rating/getAppRatingReviewForWeb?appKey=all
//     let url = "https://api-cms-v2-dot-micro-enigma-235001.appspot.com/api/app-rating/getAppRatingReviewForWeb?appKey=" + appKey;
//     let reviews = await GET({ url });
//     return reviews;
// };

export const sendEmailSubscribeApiV4 = async (email: string, message: string, appName: string) => {
    //https://test-dot-micro-enigma-235001.appspot.com/api/web?type=send-email&fromEmail=hiepnx27@gmail.com&subject=title&content=content
    let url = Config.BASE_URL + `/api/web?type=send-email`;
    let response = await POST({
        url,
        params: {
            subject: `Web ${appName} Support`,
            fromEmail: email,
            content: message,
        },
    });
    return response;
};

export const getHomeSeoContentStateApi = async (stateSlug: string, baseUrl?: string) => {
    if (!END_POINT_WORD_PRESS?.length) {
        return "";
    }
    let url = "";
    if (isProduction() && isWebCDL()) {
        url = "http://localhost:3001/api/homeseo-api?stateSlug=" + stateSlug;
    }
    if (!url) {
        url =
            (baseUrl ?? END_POINT_WORD_PRESS) +
            Config.PREFIX_URL +
            APIConfig.GET_HOME_SEO_CONTENT_STATE +
            "?stateSlug=" +
            stateSlug;
    }
    let dataCache = cache.get(url);
    if (dataCache) {
        return dataCache;
    }
    let content = await GET({ url });
    if (content) {
        cache.put(url, content, Config.TIME_MEMORY_CACHE);
    }
    return content;
};
