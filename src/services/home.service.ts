import { IAppInfo } from "@/models/app/appInfo";
import Config from "../config";
import { requestGetData, requestPostData } from "./request";
import RouterApp from "@/constants/router.constant";

export const sendEmailApi = async ({
    email,
    appName,
}: {
    email: string;
    appName: string;
}) => {
    return await requestGetData({
        url: `/api/auth?type=send-email`,
        params: { email, appName },
        config: {
            baseURL: "https://test-dot-micro-enigma-235001.appspot.com",
        },
    });
};

export const verifiedCodeApi = async ({
    email,
    code,
}: {
    email: string;
    code: string;
}) => {
    return await requestGetData({
        url: `/api/auth?type=verify-code&email=${email}&code=${code}`,
        params: {
            email,
            code,
        },
        config: {
            baseURL: "https://test-dot-micro-enigma-235001.appspot.com",
        },
    });
};

// *NOTE: can check lai

export const END_POINT_WORD_PRESS =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.length &&
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL != "null"
        ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL
        : null;
export const API_SEND_EMAIL = "https://webpush.passemall.com/api/send-contact";

export const sendEmailSubscribe = async ({
    email,
    message,
    appName,
}: {
    email: string;
    message: string;
    appName: string;
}) => {
    const url = `/api/web?type=send-email`;
    return await requestPostData({
        url,
        data: {
            subject: `Web ${appName} Support`,
            fromEmail: email,
            content: message,
        },
        config: {
            baseURL: "https://test-dot-micro-enigma-235001.appspot.com",
        },
    });
};

export const getAppReviewApi = async (appId: string) => {
    const data = await requestGetData({
        url:
            "https://dashboard-api2.abc-elearning.org/ratings-reviews?appID=" +
            appId,
    }).catch((e) => console.log(e));
    if (data) {
        return data;
    }
    return null;
};

export const genLinkPro = (appInfo: IAppInfo, hasParams = false) => {
    let url = RouterApp.Get_pro;
    if (appInfo?.appNameId && !!hasParams) {
        url += "?appNameId" + "=" + appInfo.appNameId;
    }
    return url;
};

type IRes = {
    titleSEO: string;
    title: string;
    keywordSEO: string;
    description: string;
    descriptionSEO: string;
};

export const getSEOAndHeaderContentApi = async (
    isHomePage: boolean,
    pathname?: string,
    isState?: boolean
): Promise<IRes | null> => {
    const url = "wp-json/passemall/v1/get-seo-and-header-content";
    const result = (await requestPostData({
        url: url,
        data: {
            isHomePage,
            pathname,
            isState,
        },
    })) as IRes;

    return result;
};

export const sendEmailSubscribeApiV4 = async (
    email: string,
    message: string,
    appName: string
) => {
    //https://test-dot-micro-enigma-235001.appspot.com/api/web?type=send-email&fromEmail=hiepnx27@gmail.com&subject=title&content=content
    const response = await requestPostData({
        url: Config.BASE_URL + `/api/web?type=send-email`,
        data: {
            subject: `Web ${appName} Support`,
            fromEmail: email,
            content: message,
        },
    });
    return response;
};
