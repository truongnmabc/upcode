"use client";
import BannerDownloadApp from "@/components/bannerDownload/bannerDownloadApp";
import MyContainer from "@/components/container";
import HeaderMobile from "@/components/headerMobile";
import AnswerSheet from "@/components/listLeftQuestions";
import SeoContent from "@/components/seoContent/seoContent";
import { selectIdTopic } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import { Grid2 } from "@mui/material";
import { Fragment, useEffect } from "react";
import MainViewFinalTest from "./mainView";

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
                            <AnswerSheet isCenter isActions />
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
            <LoadData />
        </Fragment>
    );
};

export default FinalTestLayout;

const LoadData = () => {
    const idTopics = useAppSelector(selectIdTopic);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!idTopics || idTopics === -1) {
            dispatch(initFinalTestThunk());
        }
    }, [idTopics, dispatch]);

    return null;
};
