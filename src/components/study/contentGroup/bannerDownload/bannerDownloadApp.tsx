"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { useIsMobile } from "@/hooks/useIsMobile";
import { appInfoState } from "@/redux/features/appInfo";
import IconLinkStoreApp from "@/components/iconLinkStoreApp";
import ImgRightBannerApp from "./imgRight";
const BannerDownloadApp = () => {
    const { appInfo } = useAppSelector(appInfoState);
    const isMobile = useIsMobile();
    return (
        <div className="bg-white hidden sm:flex  justify-between items-center gap-3 flex-col sm:flex-row dark:bg-black rounded-md overflow-hidden">
            <div className="p-4 flex flex-col gap-6 sm:p-6">
                <h4 className="text-sm sm:text-xl  text-center  font-semibold">{`Get all ${
                    appInfo.totalQuestion
                }+ ${appInfo.appName.toUpperCase()} exam-like questions with our mobile apps!`}</h4>
                {!isMobile && (
                    <div className="flex items-center justify-center gap-2">
                        <IconLinkStoreApp type="ios" />
                        <IconLinkStoreApp type="android" />
                    </div>
                )}
            </div>
            <ImgRightBannerApp />

            {isMobile && (
                <div className="flex pt-4 flex-col gap-2">
                    <IconLinkStoreApp type="ios" />
                    <IconLinkStoreApp type="android" />
                </div>
            )}
        </div>
    );
};
export default React.memo(BannerDownloadApp);
