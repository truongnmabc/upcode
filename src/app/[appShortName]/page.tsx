import axiosInstance from "@/common/config/axios";
import { RANDOM_COLORS } from "@/common/constants";
import { API_PATH } from "@/common/constants/api.constants";
import TitleHomeApp from "@/container/home/title";
import GridTopics from "@/container/home/gridTopic/gridTopics";
import { ITopic } from "@/lib/models/topics/topics";
import { fetchAppData } from "./layout";
import SeoContent from "@/container/home/seo";
import DownloadApp from "@/container/home/downloadApp/downloadApp";

type Params = {
  params: Promise<{ appShortName: string }>;
};

export default async function Home({ params }: Params) {
  try {
    const resolvedParams = await params;
    const appShortName = resolvedParams?.appShortName || process.env.APP_ID;

    const { appInfo } = await fetchAppData(appShortName);

    if (!appInfo) {
      throw new Error("App info not found");
    }

    const response = await axiosInstance.get(
      `${API_PATH.GET_DATA_STUDY}/${appInfo?.appShortName}`
    );

    const topics: ITopic[] = response?.data?.data?.topic || [];

    return (
      <section className="w-full h-full mx-auto max-w-page px-4 sm:px-6">
        <div className="w-full h-full flex flex-col gap-4 sm:gap-8 py-6 sm:py-9">
          <TitleHomeApp appInfo={appInfo} />
          <GridTopics
            isAll={topics.length > 0}
            topics={topics.map((item, index) => ({
              ...item,
              color: RANDOM_COLORS[index % RANDOM_COLORS.length],
            }))}
            appInfo={appInfo}
          />
          <DownloadApp />
          <SeoContent content={""} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading Home component:", error);
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
