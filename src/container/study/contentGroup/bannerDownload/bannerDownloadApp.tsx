"use client";

import React from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { appInfoState } from "@/lib/redux/features/appInfo";
import DownloadApp from "@/container/home/downloadApp/downloadApp";
import LazyLoadImage from "@/components/images";
const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);
  const isMobile = useIsMobile();
  return (
    <div className="bg-white hidden sm:flex  justify-between items-center gap-3 flex-col sm:flex-row dark:bg-black rounded-md overflow-hidden">
      <div className="p-4 flex flex-col gap-6 sm:p-6">
        <h4 className="text-sm sm:text-xl  text-center  font-semibold">{`Get all ${
          appInfo.totalQuestion
        }+ ${appInfo.appName.toUpperCase()} exam-like questions with our mobile apps!`}</h4>
        {!isMobile && (
          <DownloadApp
            classNames="w-full justify-center"
            appInfo={appInfo}
            size="l"
          />
        )}
      </div>

      <LazyLoadImage
        src="/images/banner/study-banner-download-app.webp"
        classNames="w-full flex justify-center sm:w-1/3 h-full bg-no-repeat "
      />
      {isMobile && (
        <div style={{ padding: "16px" }}>
          <DownloadApp appInfo={appInfo} size="m" />
        </div>
      )}
    </div>
  );
};
const BannerDownloadApp = React.memo(FN);
export default BannerDownloadApp;
