import Grid2 from "@mui/material/Grid2";
import SeoContent from "@/components/seoContent/seoContent";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import HeaderMobile from "@/components/study/headerMobile";
import AnswerSheet from "@/components/study/questionGroup/answer/answerSheet";
import FinalTestBtn from "@/components/study/questionGroup/finalTestBtn/finalTestBtn";
import GridTestsLeft from "@/components/study/questionGroup/gridTests/gridTestsLeft";
import GridTopicLeft from "@/components/study/questionGroup/gridTopics/gridTopicLeft";
import MyContainer from "@/components/container";
import ContentTestView from "./content";
import { Fragment } from "react";

const Diagnostic_test = ({ contentSeo }: { contentSeo: string }) => {
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
            <MyContainer>
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
                            <div className="flex flex-col gap-4">
                                <AnswerSheet />
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
                        <div className="w-full  min-h-full flex flex-1 flex-col gap-4 sm:gap-6    h-full">
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
};

export default Diagnostic_test;
