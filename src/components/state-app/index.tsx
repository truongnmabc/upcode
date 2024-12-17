import { IAppInfo } from "@/models/app/appInfo";
import React, { Fragment } from "react";
import MyContainer from "../v4-material/myContainer";
import DownloadApp from "../home/downloadApp/downloadApp";
import BtnGotoState from "./listState";
const HomeSingleApp = ({ appInfo }: { appInfo: IAppInfo }) => {
    return (
        <Fragment>
            <div className="w-full  bg-[#e6ded7] bg-[url('/images/state-background.png')] bg-no-repeat bg-center bg-cover   ">
                <MyContainer className="pb-6 sm:pb-12">
                    <div className="flex sm:pt-12 pt-6 flex-col items-center justify-center">
                        <h1 className="font-bold capitalize text-center sm:text-[52px] sm:leading-[64px] text-4xl">
                            {appInfo?.appName + " Practice Test"}
                        </h1>
                        <h2 className="text-2xl sm:text-[40px] sm:leading-[60px] text-center font-normal">
                            Ace The{" "}
                            <strong className="v4-font-semi-bold">
                                {appInfo?.appName}
                            </strong>{" "}
                            On First Try
                        </h2>
                    </div>
                    <BtnGotoState appInfo={appInfo} />
                </MyContainer>
            </div>
            <MyContainer className="pb-6">
                <h3 className="text-center px-4 text-xl font-bold sm:text-[30px] sm:leading-[48px] py-6 sm:py-8">
                    Prepare to Pass {appInfo.appShortName} on Any Devices
                </h3>
                <DownloadApp />
            </MyContainer>
        </Fragment>
    );
};

export default HomeSingleApp;
