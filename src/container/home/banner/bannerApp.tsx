import { IAppInfo } from "@/lib/models/appInfo";
import React from "react";
const FN = ({ appInfo }: { appInfo: IAppInfo }) => {
  return (
    <div>
      <h1 className="text-4xl sm:text-[52px] sm:leading-[64px] font-bold text-center capitalize  sm:pb-4  font-vampiro">{` ${appInfo?.appName} Practice Test`}</h1>

      <h2 className="text-2xl  sm:text-[40px] font-normal font-poppins text-center">
        Ace The{" "}
        <strong className="font-poppins font-medium">{appInfo?.appName}</strong>{" "}
        On First Try
      </h2>
    </div>
  );
};

const BannerApp = React.memo(FN);
export default BannerApp;
