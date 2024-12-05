import StudyLayout from "@/container/study/studyLayout";
import { fetchAppData } from "../../layout";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
type Params = Promise<{ appShortName: string; slug: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const appId = params?.appShortName || process.env.APP_ID;
  const { appInfo, appConfig } = await fetchAppData(appId);
  const response = await axiosInstance.get(
    `${API_PATH.GET_SEO}/${appInfo.appShortName}`
  );

  return <StudyLayout contentSeo={response.data.content} />;
}
