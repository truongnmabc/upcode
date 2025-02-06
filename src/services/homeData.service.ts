import axiosInstance from "@/config/axios";
import { API_PATH } from "@/constants/api.constants";
import { IAppInfo } from "@/models/app/appInfo";
import { ITopicBase } from "@/models/topics/topicsProgress";
import { fetchAppData } from "@/utils/getAppInfos";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = process.cwd();
const rootPath = path.join(DATA_PATH, "src", "data", "home");

const filePaths = {
    appInfos: path.join(rootPath, "appInfos.json"),
    topics: path.join(rootPath, "topics.json"),
    seo: path.join(rootPath, "seo.json"),
};

// ✅ Type cho dữ liệu trả về
interface IRes {
    appInfos: IAppInfo;
    topics: ITopicBase[];
    contentSeo: string;
}

// ✅ Hàm đọc file JSON an toàn
const readJsonFile = async <T>(filePath: string): Promise<T | null> => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Lỗi đọc file: ${filePath}`, error);
        return null;
    }
};

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
            const [appInfosData, topicsData, seoData] = await Promise.all([
                readJsonFile<IAppInfo>(filePaths.appInfos),
                readJsonFile<{ topic: ITopicBase[] }>(filePaths.topics),
                readJsonFile<{ content: string }>(filePaths.seo),
            ]);

            appInfos = appInfosData || ({} as IAppInfo);
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
            }));
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
