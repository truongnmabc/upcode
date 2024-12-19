import { fetchAppData } from "@/app/[appShortName]/layout";
import axiosInstance from "@/common/config/axios";
import { listAppState } from "@/common/constants";
import { API_PATH } from "@/common/constants/api.constants";
import NewHome from "@/components/state-app/newHome";
import { ITestInfo } from "@/models/tests/tests";
import { ITopicResState } from "@/models/topics/topics";
import { getSEOAndHeaderContentApi } from "@/services/home.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

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
    const { appShortName, state } = await params;

    if (listAppState.includes(appShortName)) {
        const response = await axiosInstance.get(
            `${API_PATH.GET_DATA_STATE}/${appShortName}?state=${state}`
        );
        const { appInfo } = await fetchAppData(appShortName);
        const data: IRes = response?.data?.data;
        if (!data || !appInfo) {
            redirect(`/${appShortName}`);
        }
        return (
            <NewHome
                listTopics={data.topics}
                tests={data.fullTests}
                _state={state}
                appInfo={appInfo}
            />
        );
    }
    redirect(`/${appShortName}`);
}
