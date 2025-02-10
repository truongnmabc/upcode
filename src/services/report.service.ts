import { BASE_URL } from "@/constants";
import { requestPostData } from "./request";
import { API_PATH } from "@/constants/api.constants";

async function reportMistakeApi({
    appId,
    base64Image,
    reason,
    details,
    questionId,
    appName,
}: {
    appId: number;
    base64Image?: string;
    reason: string;
    details: string[];
    questionId: number;
    appName: string;
}) {
    try {
        const image = base64Image?.replace("data:image/png;base64,", "");

        const param = {
            image: image,
            reason: reason,
            detail: details,
            questionId: questionId,
            appId: appId,
            appName: appName,
            version: "0",
            buildNumber: -1,
            gameType: -1,
            dbVersion: 1,
            link: window.location.href,
        };
        const response = await requestPostData({
            url: API_PATH.REPORT_MISTAKE,
            config: {
                baseURL: BASE_URL,
            },
            data: param,
        });
        return response;
    } catch (error) {
        console.error("Error reporting mistake:", error);
        throw error;
    }
}

export default reportMistakeApi;
