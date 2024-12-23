"use client";
import Grid2 from "@mui/material/Grid2";
import React from "react";
import SeoContent from "../seoContent/seoContent";
import BannerDownloadApp from "../study/contentGroup/bannerDownload/bannerDownloadApp";
import HeaderMobile from "../study/headerMobile";
import AnswerSheet from "../study/questionGroup/answer/answerSheet";
import ContentCustomTest from "./contentCustomTest";
import GridLeftCustomTest from "./gridLeft";

const CustomTest = ({ contentSeo }: { contentSeo: string }) => {
    return (
        <div className="flex-1 max-w-page sm:px-4 mx-auto">
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
                        <div className=" hidden h-full flex-col gap-4 sm:flex w-full">
                            <AnswerSheet />
                            <GridLeftCustomTest />
                        </div>
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <div className="w-full  min-h-full flex flex-1 flex-col gap-4 sm:gap-6  p-4 sm:p-0  h-full">
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
            </div>
        </div>
    );
};

export default React.memo(CustomTest);
