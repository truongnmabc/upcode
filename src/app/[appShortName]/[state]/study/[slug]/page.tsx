import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import MyContainer from "@/components/container/myContainer";
import SeoContent from "@/components/seoContent/seoContent";
import MainStudyView from "@/components/study/mainStudyView";
import HeaderMobile from "@/components/study/headerMobile";
import QuestionGroup from "@/components/study/questionGroup";
import Grid2 from "@mui/material/Grid2";
import React, { Fragment } from "react";

type Params = Promise<{ appShortName: string; slug: string }>;

export default async function Page(props: { params: Params }) {
    const params = await props.params;

    const appShortName = params?.appShortName;

    const response = await axiosInstance.get(
        `${API_PATH.GET_SEO}/${appShortName}?search=${params.slug}`
    );

    const contentSeo = response.data.data.content;
    return (
        <Fragment>
            <Grid2 container>
                <Grid2
                    size={{
                        sm: 0,
                        md: 0,
                        xs: 12,
                    }}
                >
                    <HeaderMobile />
                </Grid2>
            </Grid2>
            <MyContainer className="py-4">
                <Grid2
                    container
                    spacing={{ xs: 0, sm: 2 }}
                    className="w-full h-full"
                >
                    <Grid2
                        size={{
                            sm: 3,
                            xs: 0,
                        }}
                    >
                        <QuestionGroup />
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <div className="w-full  min-h-full flex flex-1 flex-col gap-4 sm:gap-6   h-full">
                            <MainStudyView />
                            <BannerDownloadApp />
                            {contentSeo && (
                                <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                                    <SeoContent content={contentSeo} />
                                </div>
                            )}
                        </div>
                    </Grid2>
                </Grid2>
            </MyContainer>
        </Fragment>
    );
}
