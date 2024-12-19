import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import StudyLayout from "@/components/study/studyLayout";

type Params = Promise<{ appShortName: string; slug: string }>;

export default async function Page(props: { params: Params }) {
    const params = await props.params;

    const appShortName = params?.appShortName;

    const response = await axiosInstance.get(
        `${API_PATH.GET_SEO}/${appShortName}?search=${params.slug}`
    );
    return <StudyLayout contentSeo={response.data.data.content} />;
}
