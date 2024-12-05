import BannerApp from "@/container/home/banner/bannerApp";
import { fetchAppData } from "./layout";
import axiosInstance from "@/common/config/axios";
import GridTopics from "@/container/home/gridTopic/gridTopics";
import { RANDOM_COLORS } from "@/common/constants";
import { ITopic } from "@/lib/models/topics/topics";
import { API_PATH } from "@/common/constants/api.constants";

type Params = Promise<{ appShortName: string }>;

export default async function Home(props: { params: Params }) {
  const params = await props.params;
  const appId = params?.appShortName || process.env.APP_ID;
  const { appInfo, appConfig } = await fetchAppData(appId);

  const response = await axiosInstance.get(
    `${API_PATH.GET_DATA_STUDY}/${appInfo.appShortName}`
  );

  const {
    tests,
    topic,
  }: {
    topic: ITopic[];
    tests: any;
  } = response?.data?.data;

  return (
    <section className="w-full h-full mx-auto max-w-page px-4 sm:px-6">
      <div
        id="home_id"
        className="w-full h-full flex flex-col gap-4 sm:gap-8 py-6 sm:py-9"
      >
        <BannerApp appInfo={appInfo} />
        <GridTopics
          isAll={topic?.length > 0}
          topics={topic.map((item, index) => ({
            ...item,
            color: RANDOM_COLORS[index],
          }))}
          appInfo={appInfo}
        />
      </div>
    </section>
  );
}
