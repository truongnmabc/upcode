import APIConfig from "@/config/api_config";
import Routes from "@/config/routes";
import { callApi } from ".";
import Config from "../config";
import { GET, POST } from "./request";

export const END_POINT_WORD_PRESS =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.length && process.env.NEXT_PUBLIC_WORDPRESS_API_URL != "null"
        ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL
        : null;
export const API_SEND_EMAIL = "https://webpush.passemall.com/api/send-contact";

// export const getHomeSeoContentApi = async (postUrl: string) => {
//     try {
//         if (!END_POINT_WORD_PRESS?.length) {
//             throw "END_POINT_NULL!";
//         }
//         let url = END_POINT_WORD_PRESS + Config.PREFIX_URL + APIConfig.GET_HOME_SEO_CONTENT + "?posturl=" + postUrl; // hàm mới
//         let content = await GET({ url });
//         return content;
//     } catch (err) {
//         console.log(err);
//         return { content: "" };
//     }
// };
export const getHomeSeoContentApi = async (postUrl: string) => {
    if (!END_POINT_WORD_PRESS?.length) {
        return "";
    }
    let url = END_POINT_WORD_PRESS + Config.PREFIX_URL + APIConfig.GET_HOME_SEO_CONTENT + "?posturl=" + postUrl; //cdl cũ
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
    let url =
        (baseUrl ?? END_POINT_WORD_PRESS) +
        Config.PREFIX_URL +
        APIConfig.GET_HOME_SEO_CONTENT_STATE +
        "?stateSlug=" +
        stateSlug;

    // console.log("home.services", url);
    // let dataCache = cache.get(url);
    // console.log(dataCache);
    // if (dataCache) {
    //     return dataCache;
    // }
    let content = await GET({ url });
    // if (content) {
    //     cache.put(url, content, Config.TIME_MEMORY_CACHE);
    // }
    return content;
};

export const getAppReviewApi = async (appId) => {
    let data = await callApi({
        url: "https://dashboard-api2.abc-elearning.org/ratings-reviews?appID=" + appId,
        method: "get",
        params: null,
    }).catch((e) => console.log(e));
    if (data) {
        return data;
    }
    return null;
};

export const genLinkPro = (appInfo, hasParams = false) => {
    let url = Routes.UPGRADE_PRO;
    if (appInfo?.appNameId && !!hasParams) {
        url += "?appNameId" + "=" + appInfo.appNameId;
    }
    return url;
};

export const getSEOAndHeaderContentApi = async (isHomePage: boolean, pathname?: string, isState?: boolean) => {
    if (!END_POINT_WORD_PRESS) {
        return null;
    }
    const url = END_POINT_WORD_PRESS + Config.PREFIX_URL + APIConfig.GET_SEO_AND_HEADER_CONTENT;

    let result = await POST({
        url: url,
        params: {
            isHomePage,
            pathname,
            isState,
        },
    });

    return result;
};
