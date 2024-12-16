"use client";
import LogoHeader from "@/components/header/logo/logoHeader";
import { useIsMobile } from "@/hooks/useIsMobile";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import clsx from "clsx";
import React from "react";
import { DmcaIcon } from "./iconDmca";

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);
  const isMobile = useIsMobile();
  return (
    <div className="  h-full flex flex-col gap-6">
      <div className="w-full flex justify-between">
        <LogoHeader />
        {isMobile && <DmcaIcon />}
      </div>
      <div
        className={clsx(
          "text-white text-[13px] font-normal lg:max-w-[240px] leading-5",
          {
            "text-center": isMobile,
          }
        )}
      >
        {appInfo.descriptionSEO}
      </div>
      {!isMobile && <DmcaIcon />}
    </div>
  );
};
const InfoFooter = React.memo(FN);
export default InfoFooter;
