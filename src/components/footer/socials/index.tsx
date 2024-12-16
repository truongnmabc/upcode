"use client";
import FacebookIcon from "@/components/icon/FacebookIcon";
import TwitterIcon from "@/components/icon/TwitterIcon";
import YoutubeIcon from "@/components/icon/YoutubeIcon";
import { useIsMobile } from "@/hooks/useIsMobile";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { getContactApp } from "@/utils/getContact";
import clsx from "clsx";
import React from "react";

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);
  const { facebook, twitter, youtube } = getContactApp(appInfo.appShortName);
  const isMobile = useIsMobile();
  return (
    <div
      className={clsx("flex gap-4 w-fit  items-center", {
        "justify-center": isMobile,
      })}
    >
      {facebook && (
        <div>
          <a href={facebook}>
            <FacebookIcon color="#ffffffb8" />
          </a>
        </div>
      )}
      {twitter && (
        <div>
          <a href={twitter}>
            <TwitterIcon color="#ffffffb8" />
          </a>
        </div>
      )}
      {youtube && (
        <div>
          <a href={youtube}>
            <YoutubeIcon color="#ffffffb8" />
          </a>
        </div>
      )}
    </div>
  );
};
const SocialsIcon = React.memo(FN);
export default SocialsIcon;
