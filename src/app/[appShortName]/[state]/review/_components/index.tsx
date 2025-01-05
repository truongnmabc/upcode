"use client";
import Grid2 from "@mui/material/Grid2";
import SeoContent from "@/components/seoContent/seoContent";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import ReviewContentGroup from "./content";
import ReviewProvider from "../_components/context/reviewContext";
import TitleReview from "./content/title";
import ListReview from "./gridLeftReview/listReview";

const ReviewView = ({ contentSeo }: { contentSeo: string }) => {
    return (
        <div className="sm:py-4" id="v4-study-main-view-0">
            <ReviewProvider>
                <TitleReview />

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
                        <div className="hidden sm:flex flex-col gap-3">
                            <p className="text-xl font-semibold">Review</p>
                            <ListReview />
                        </div>
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
