import React from "react";

import { API_PATH } from "@/common/constants/api.constants";
import FinalTestLayout from "@/components/finalTest";
import axiosInstance from "@/common/config/axios";

type Params = {
    params: Promise<{ appShortName: string; slug: string }>;
};
export default async function FinalTestPage({ params }: Params) {
    const { appShortName, slug } = await params;

    // const { appInfo } = await fetchAppData(appShortName);

    // if (!appInfo) {
    //     throw new Error("App info not found");
    // }

    const seoData = await axiosInstance.get(
        `${API_PATH.GET_SEO}/${appShortName}?search=${slug}&type=final_test`
    );

    return <FinalTestLayout contentSeo={seoData.data.data.content} />;
}
