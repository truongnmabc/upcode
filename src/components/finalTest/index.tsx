import SeoContent from "@/components/seoContent/seoContent";
import { Grid2 } from "@mui/material";
import MainViewFinalTest from "./mainView";
import BannerDownloadApp from "../bannerDownload/bannerDownloadApp";
import AnswerSheet from "../study/questionGroup/answer/answerSheet";
import { Fragment } from "react";
import HeaderMobile from "../study/headerMobile";
import MyContainer from "../container/myContainer";

const FinalTestLayout = ({ contentSeo }: { contentSeo: string }) => {
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
                        <div className="hidden sm:block">
                            <AnswerSheet isActions />
                        </div>
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <div className="w-full flex flex-1 flex-col gap-4 sm:gap-6  sm:p-0  h-full">
                            <MainViewFinalTest />
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

export default FinalTestLayout;
