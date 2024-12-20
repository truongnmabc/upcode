import { IMember, Member } from "@/models/member-contact/member";
import { requestGetData } from "./request";

export const getMemberApi = async (): Promise<IMember[]> => {
    try {
        const response = await requestGetData({
            config: {
                baseURL: "https://cdl-prep.com",
                headers: {},
            },
            url: "https://cdl-prep.com/wp-json/passemall/v1/get-all-members",
        });
        if (Array.isArray(response)) {
            return response.map((item) => new Member(item));
        }
        console.error("Dữ liệu API không hợp lệ:", response);
        return [];
    } catch (error) {
        console.error("error call API:", error);
        return [];
    }
};
