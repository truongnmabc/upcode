"use client";
import Grid2 from "@mui/material/Grid2";
import SeoContent from "@/components/seoContent/seoContent";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import ReviewContentGroup from "./content";
import ReviewProvider from "./context";
import TitleReview from "./content/title";
import ListReview from "./gridLeftReview/listReview";
import AnswerReview from "./gridLeftReview/answer";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { resetState } from "@/redux/features/game";

const ReviewView = ({
    contentSeo,
    isMobile,
}: {
    contentSeo?: string;
    isMobile: boolean;
}) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(resetState());
    }, [dispatch]);

    return (
        <div className="sm:py-4 pb-4 " id="v4-study-main-view-0">
            <ReviewProvider>
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
                        <div className="flex flex-col gap-3">
                            {!isMobile && <AnswerReview />}
                            <ListReview isMobile={isMobile} />
                        </div>
                    </Grid2>
                    <Grid2
                        size={{
                            sm: 9,
                            xs: 12,
                        }}
                    >
                        <div className="w-full h-full flex flex-col gap-4 sm:gap-6 ">
                            {!isMobile && <TitleReview />}
                            <ReviewContentGroup isMobile={isMobile} />
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
