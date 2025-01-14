import React from "react";

import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "@/config/axios";
import FinalTestLayout from "./_components";

type Params = {
    params: Promise<{ appShortName: string; slug: string }>;
};
export default async function FinalTestPage({ params }: Params) {
    const { appShortName, slug } = await params;

    const seoData = await axiosInstance.get(
        `${API_PATH.GET_SEO}/${appShortName}?search=${slug}&type=final_test`
    );

    return <FinalTestLayout contentSeo={seoData.data.data.content} />;
}
