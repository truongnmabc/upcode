import { IAppInfo } from "@/lib/models/appInfo";
import ctx from "@/utils/mergeClass";
import React from "react";
const sizeMap = {
  s: { w: 90, h: 26 },
  m: { w: 120, h: 35 },
  l: { w: 180, h: 52 },
};
const FN = ({
  appInfo,
  size,
  classNames,
}: {
  appInfo: IAppInfo;
  classNames?: string;
  size: "s" | "m" | "l";
}) => {
  return (
    <div className={ctx("flex gap-2", classNames)}>
      {!!appInfo.linkIos && (
        <a
          className="v4-button-animtaion"
          href={appInfo.linkIos}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            // ga.event({
            //   action: "click_app_store",
            //   params: {},
            // });
            // ga.event({
            //   action: place + "_click_app_store",
            //   params: {},
            // });
          }}
        >
          <img
            src="/images/download/download_ios.webp"
            // loading="lazy"
            width={sizeMap[size].w}
            height={sizeMap[size].h}
            alt="ios_download"
          />
        </a>
      )}
      {!!appInfo.linkAndroid && (
        <a
          className="v4-button-animtaion"
          href={appInfo.linkAndroid}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            // ga.event({
            //   action: "click_gg_store",
            //   params: {},
            // });
            // ga.event({
            //   action: place + "_click_gg_store",
            //   params: {},
            // });
          }}
        >
          <img
            src="/images/download/download_android.webp"
            // loading="lazy"
            alt="android_download"
            height={sizeMap[size].h}
            width={sizeMap[size].w}
          />
        </a>
      )}
    </div>
  );
};
const DownloadApp = React.memo(FN);
export default DownloadApp;
