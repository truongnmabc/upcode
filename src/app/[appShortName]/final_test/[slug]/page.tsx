import React from "react";
import { fetchAppData } from "../../layout";
import axiosInstance from "@/common/config/axios";

import { API_PATH } from "@/common/constants/api.constants";
import FinalTestLayout from "@/components/finalTest";

type Params = {
  params: Promise<{ appShortName: string; slug: string }>;
};
export default async function FinalTestPage({ params }: Params) {
  const { appShortName, slug } = await params;

  const { appInfo } = await fetchAppData(appShortName);

  if (!appInfo) {
    throw new Error("App info not found");
  }

  const seoData = await axiosInstance.get(
    `${API_PATH.GET_SEO}/${appInfo?.appShortName}?search=${slug}&type=final_test`
  );

  return (
    <section className="w-full h-full mx-auto max-w-page px-4 sm:px-6">
      <div className="w-full h-full  py-6 sm:py-9">
        <FinalTestLayout
          contentSeo={seoData.data.data.content}
          appShortName={appInfo.appShortName}
        />
      </div>
    </section>
  );
}
