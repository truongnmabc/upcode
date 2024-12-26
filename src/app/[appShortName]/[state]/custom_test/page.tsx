import MyContainer from "@/components/container/myContainer";
import { Fragment } from "react";
import { Grid2 } from "@mui/material";
import HeaderMobile from "@/components/study/headerMobile";
import LeftLayout from "@/components/customTest/leftLayout";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import ContentCustomTest from "@/components/customTest/contentCustomTest";
import SeoContent from "@/components/seoContent/seoContent";

export default async function CustomPage() {
    const contentSeo = "";
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
                            xs: 12,
                        }}
                    >
                        <LeftLayout />
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <div className="w-full  min-h-full flex flex-1 flex-col gap-4 sm:gap-6    h-full">
                            <ContentCustomTest />
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
