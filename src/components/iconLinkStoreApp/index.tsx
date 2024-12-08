"use client";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
import { trackingEventGa4 } from "@/lib/services/googleEvent";
import ctx from "@/utils/mergeClass";
import React from "react";
import LazyLoadImage from "../images";

const IconLinkStoreApp = ({
  type,
  classNames,
}: {
  type: "ios" | "android";
  classNames?: string;
}) => {
  const { appInfo } = useAppSelector(appInfoState);

  return (
    <LazyLoadImage
      src={
        type === "ios"
          ? "/images/download/download_ios.webp"
          : "/images/download/download_android.webp"
      }
      classNames={ctx(
        "w-[90px] h-[26px] sm:w-[180px] cursor-pointer sm:h-[52px]",
        classNames
      )}
      onClick={() => {
        trackingEventGa4({
          eventName: type === "ios" ? "click_app_store" : "click_gg_store",
          value: {},
        });
        window.open(
          type === "ios" ? appInfo.linkIos : appInfo.linkAndroid,
          "_blank"
        );
      }}
    />
  );
};

export default React.memo(IconLinkStoreApp);
