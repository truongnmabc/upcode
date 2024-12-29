"use client";
import Grid2 from "@mui/material/Grid2";
import SeoContent from "../seoContent/seoContent";
import BannerDownloadApp from "../bannerDownload/bannerDownloadApp";
import GridLeftReview from "./gridLeftReview";
import ReviewContentGroup from "./gridLeftReview/content";
import ReviewProvider from "./context/reviewContext";

const ReviewView = ({ contentSeo }: { contentSeo: string }) => {
    return (
        <div className="sm:py-4" id="v4-study-main-view-0">
            <ReviewProvider>
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
                        <GridLeftReview />
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <div className="w-full flex flex-1 flex-col gap-4 sm:gap-6  p-4 sm:p-0  h-full">
                            <ReviewContentGroup />
                            <BannerDownloadApp />
                            {contentSeo && (
                                <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
                                    <SeoContent content={contentSeo} />
                                </div>
                            )}
                        </div>
                    </Grid2>
                </Grid2>
            </ReviewProvider>
        </div>
    );
};

export default ReviewView;
