import axiosInstance from "@/config/axios";
import { API_PATH } from "@/constants/api.constants";
import { IAppInfo } from "@/models/app/appInfo";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { fetchAppData } from "@/utils/getAppInfos";

// 📌 Import JSON thay vì dùng fs.readFile()
import appInfosData from "@/data/home/appInfos.json";
import topicsData from "@/data/home/topics.json";
import seoData from "@/data/home/seo.json";

// ✅ Type cho dữ liệu trả về
interface IRes {
    appInfos: IAppInfo;
    topics: ITopicBase[];
    contentSeo: string;
}

// ✅ Hàm fetch dữ liệu trang chủ
export const fetchAppDataHomePage = async (
    appShortName: string
): Promise<IRes> => {
    let appInfos: IAppInfo = {} as IAppInfo;
    let topics: ITopicBase[] = [];
    let contentSeo = "";

    try {
        const isSingleApp = process.env["NEXT_PUBLIC_APP_SHORT_NAME"];

        if (isSingleApp) {
            // 📌 Đọc dữ liệu từ file JSON nếu là Single App
            appInfos = appInfosData as unknown as IAppInfo;
            contentSeo = seoData?.content || "";

            topics = (topicsData?.topic || []).map((topic) => ({
                ...topic,
                id: Number(topic.id),
                topics: topic.topics?.map((item) => ({
                    ...item,
                    slug: `${item.tag}-practice-test`,
                    topics: item.topics?.filter(
                        (subItem) => subItem.contentType === 0
                    ),
                })),
                slug: `${topic.tag}-practice-test`,
            })) as unknown as ITopicBase[];
        } else {
            // 📌 Gọi API nếu không phải Single App
            const [topicsRes, seoRes, appInfoRes] = await Promise.all([
                axiosInstance.get<{ topic: ITopicBase[] }>(
                    `${API_PATH.GET_DATA_STUDY}/${appShortName}`
                ),
                axiosInstance.get<{ content: string }>(
                    `${API_PATH.GET_SEO}/${appShortName}`
                ),
                fetchAppData(appShortName),
            ]);

            appInfos = appInfoRes.appInfo || ({} as IAppInfo);
            topics = topicsRes.data?.topic || [];
            contentSeo = seoRes.data?.content || "";
        }
    } catch (error) {
        console.error("❌ Lỗi khi fetch dữ liệu trang chủ:", error);
    }

    // ✅ Trả về dữ liệu một lần duy nhất
    return {
        appInfos,
        topics,
        contentSeo,
    };
};
