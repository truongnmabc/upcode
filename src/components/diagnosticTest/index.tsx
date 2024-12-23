import Grid2 from "@mui/material/Grid2";
import SeoContent from "../seoContent/seoContent";
import BannerDownloadApp from "../study/contentGroup/bannerDownload/bannerDownloadApp";
import HeaderMobile from "../study/headerMobile";
import AnswerSheet from "../study/questionGroup/answer/answerSheet";
import FinalTestBtn from "../study/questionGroup/finalTestBtn/finalTestBtn";
import GridTestsLeft from "../study/questionGroup/gridTests/gridTestsLeft";
import GridTopicLeft from "../study/questionGroup/gridTopics/gridTopicLeft";
import MyContainer from "../v4-material/myContainer";
import ContentTestView from "./content";

const Diagnostic_test = ({ contentSeo }: { contentSeo: string }) => {
    return (
        <MyContainer>
            {/* <Grid2 container>
                <Grid2
                    size={{
                        sm: 0,
                        md: 0,
                        xs: 12,
                    }}
                >
                    <HeaderMobile />
                </Grid2>
            </Grid2> */}
            <div className="sm:py-4" id="v4-study-main-view-0">
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
                                <div className="w-full h-[1x] bg-[#21212129]"></div>
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
                        <div className="w-full  min-h-full flex flex-1 flex-col gap-4 sm:gap-6  p-4 sm:p-0  h-full">
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
            </div>
        </MyContainer>
    );
};

export default Diagnostic_test;
