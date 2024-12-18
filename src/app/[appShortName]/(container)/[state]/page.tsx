import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import React from "react";

import type { Metadata, ResolvingMetadata } from "next";
import { getSEOAndHeaderContentApi } from "@/services/home.service";

type Props = {
    params: Promise<{ appShortName: string; state: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { appShortName, state } = await params;

    const response = await getSEOAndHeaderContentApi(false, state, true);
    console.log("🚀 ~ response:", response);

    // const previousImages = (await parent).openGraph?.images || [];
    // return {
    //     title: response.title,
    //     openGraph: {
    //         images: ["/some-specific-page-image.jpg", ...previousImages],
    //     },
    // };
    return {
        title: "",
    };
}

type Params = {
    params: Promise<{ appShortName: string; state: string }>;
};

export default async function StatePage({ params }: Params) {
    try {
        // const { appShortName, state } = await params;

        // const response = await axiosInstance.get(
        //     `${API_PATH.GET_DATA_STATE}/${appShortName}?state=${state}`
        // );
        // console.log("🚀 ~ Home ~ response:", response.data);

        return <section className="w-full h-full  pb-12 sm:pb-6 "></section>;
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
