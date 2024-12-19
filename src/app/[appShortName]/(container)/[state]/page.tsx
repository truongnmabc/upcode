import { fetchAppData } from "@/app/[appShortName]/layout";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import NewHome from "@/components/state-app/newHome";
import { ITestInfo } from "@/models/tests/tests";
import { ITopicResState } from "@/models/topics/topics";
import { getSEOAndHeaderContentApi } from "@/services/home.service";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ appShortName: string; state: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { state } = await params;

    const response = await getSEOAndHeaderContentApi(false, state, true);

    return {
        title: response?.titleSEO,
        description: response?.descriptionSEO,
        keywords: response?.keywordSEO,
    };
}

type Params = {
    params: Promise<{ appShortName: string; state: string }>;
};

type IRes = {
    branchTests?: {};
    fullTests: ITestInfo[];
    topics: ITopicResState[];
};

export default async function StatePage({ params }: Params) {
    try {
        const { appShortName, state } = await params;

        const response = await axiosInstance.get(
            `${API_PATH.GET_DATA_STATE}/${appShortName}?state=${state}`
        );
        const { appInfo } = await fetchAppData(appShortName);
        const data: IRes = response?.data?.data;
        if (!data || !appInfo) {
            throw new Error("Not data res");
        }
        return (
            <NewHome
                listTopics={data.topics}
                tests={data.fullTests}
                _state={state}
                appInfo={appInfo}
            />
        );
    } catch (error) {
        console.log("🚀 ~ StatePage ~ error:", error);
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
