import Grid2 from "@mui/material/Grid2";
import SeoContent from "@/components/seoContent/seoContent";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import MyContainer from "@/components/container";
import { Fragment } from "react";
import HeaderMobile from "@/components/headerMobile";
import AnswerSheet from "@/components/listLeftQuestions";
import GridTestsLeft from "@/components/gridTests";
import GridTopicLeft from "@/components/gridTopics";
import FinalTestBtn from "@/components/finalTestBtn";
import ContentTestView from "./_components/content";

export default async function DiagnosticPage() {
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
            <MyContainer className="sm:py-6 py-4">
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
                        <div className="hidden sm:block w-full">
                            <div className="flex p-3 bg-white rounded-xl flex-col gap-4">
                                <AnswerSheet wrapperClassName="bg-[#2121210A]" />
                                <GridTestsLeft />
                                <div className="w-full h-[1px] bg-[#21212129]"></div>
                                <GridTopicLeft />
                                <div className="w-full h-[1px] bg-[#21212129]"></div>
                                <FinalTestBtn />
                            </div>
                        </div>
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <div className="w-full min-h-full flex flex-1 flex-col gap-4 sm:gap-6 h-full pb-24 sm:pb-0">
                            <ContentTestView />
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
