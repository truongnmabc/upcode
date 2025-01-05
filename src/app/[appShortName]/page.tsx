import axiosInstance from "@/config/axios";
import { API_PATH } from "@/constants/api.constants";
import MyContainer from "@/components/container";
import GridTest from "@/components/home/gridTests/gridTestHome";
import GridTopics from "@/components/home/gridTopic/gridTopics";
import TitleHomeApp from "@/components/home/title";
import SeoContent from "@/components/seoContent/seoContent";
import HomeSingleApp from "@/components/state-app";
import { ITopic } from "@/models/topics/topics";
import { getAppType } from "@/utils/web";
import { fetchAppData } from "@/utils/getAppInfos";
import dynamic from "next/dynamic";
const BannerHome = dynamic(
    () => import("@/components/state-app/newHome/banner/index")
);
type Params = {
    params: Promise<{ appShortName: string }>;
};

export default async function Home({ params }: Params) {
    try {
        const resolvedParams = await params;

        const appShortName = resolvedParams?.appShortName || process.env.APP_ID;

        const { appInfo } = await fetchAppData(appShortName);

        if (!appInfo) {
            return;
        }
        const [response, dataSeo] = await Promise.all([
            axiosInstance.get(
                `${API_PATH.GET_DATA_STUDY}/${appInfo?.appShortName}`
            ),
            axiosInstance.get(`${API_PATH.GET_SEO}/${appInfo?.appShortName}`),
        ]);

        const topics: ITopic[] = response?.data?.data?.topic || [];

        const appType = getAppType(appInfo.appShortName);

        const contentSeo = dataSeo.data?.content;

        if (appType === "default") {
            return (
                <MyContainer>
                    <TitleHomeApp appInfo={appInfo} />
                    <GridTopics topics={topics} appInfo={appInfo} />
                    <GridTest />
                    <div className="sm:my-[48px] sm:mb-[120px] my-[24px] mb-[48px]">
                        <BannerHome appInfo={appInfo} isHomePage={true} />
                    </div>
                    {contentSeo && (
                        <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                            <SeoContent content={contentSeo} />
                        </div>
                    )}
                </MyContainer>
            );
        }

        if (appType === "state") {
            return (
                <section className="w-full h-full  pb-12 sm:pb-6 ">
                    <HomeSingleApp appInfo={appInfo} />
                </section>
            );
        }
    } catch (error) {
        console.log("🚀 ~ Home ~ error:", error);
        return (
            <section className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-lg text-gray-600">
                        Unable to load content. Please try again later.
                    </p>
                </div>
            </section>
        );
    }
}
