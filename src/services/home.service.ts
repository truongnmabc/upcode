// import cache from "memory-cache";

import APIConfig from "@/config/api_config";
import Config from "../config";
import { GET } from "./request";

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
