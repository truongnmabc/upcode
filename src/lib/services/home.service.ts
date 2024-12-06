import { requestGetData, requestPostData } from "./request";

export const sendEmailApi = async ({
    email,
    appName,
}: {
    email: string;
    appName: string;
}) => {
    return await requestGetData({
        url: `/api/auth?type=send-email&email=${email}&appName=${appName}`,
        params: { email, appName },
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
    });
};

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
    });
};
