import React, { useEffect } from "react";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { ITestInfo } from "../../models/TestInfo";
// import * as ga from "../../lib/ga";
import useMediaQuery from "@mui/material/useMediaQuery";
import Layout2 from "@/components/layout/layout-2/Layout2";
import TestBanner from "@/components/homepage-v4/TestBanner";
import BannerDownloadApp from "@/components/homepage-v4/BannerDownloadApp";
import SeoContentComponentV2 from "@/components/seo";
import MyContainer from "@/components/v4-material/MyContainer";
import "./HomeSingleApp.scss";
import { useAppDispatch } from "@/redux/hooks";
import { setAppInfo } from "@/redux/features/appInfo";
import GridTopic from "@/components/homepage-v4/GridTopic";
const HomeSingleApp = ({
    appInfo,
    listTopics,
    homeSeoContent,
    tests,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    homeSeoContent: any;
    tests: ITestInfo[];
}) => {
    const dispatch = useAppDispatch();
    // useEffect(() => {
    //     if (window) {
    //         ga.event({
    //             action: "home_users",
    //             params: { from: window.location.href },
    //         });
    //         ga.event({
    //             action: "users_exclude_blog",
    //             params: { from: window.location.href },
    //         });
    //     }
    // }, []);
    const isDesktop = useMediaQuery("(min-width:769px)");
    return (
        <Layout2 appInfo={appInfo} listTopics={listTopics}>
            <div className="v4-home-landing-0">
                <MyContainer>
                    <div className="landing-title-0">
                        <div className="landing-title-11">
                            <h1
                                className="title-h1"
                                onClick={() => {
                                    dispatch(setAppInfo(appInfo));
                                }}
                            >
                                <span className="landing-title-21">{appInfo?.appName + " Practice Test"}</span>{" "}
                                <span className="landing-title-22">
                                    Ace The <strong className="v4-font-semi-bold">{appInfo?.appName}</strong> On First Try
                                </span>
                            </h1>
                        </div>
                        <div className="landing-title-12">
                            {"Our free " +
                                appInfo.appName +
                                " practice tests feature all 9 " +
                                appInfo.appName +
                                " test subjects. We recommend taking at least one practice exam from every subject to guarantee your success at your local testing location. To get started, choose a category from the list below and practice them!"}
                        </div>
                    </div>
                    <div className="v4-landing-topic-0">
                        <h2>{`Practice ${appInfo.appName} Test By Topics`}</h2>
                        <GridTopic place="home" listTopics={listTopics} appInfo={appInfo} allowExpand={!isDesktop} />
                    </div>

                    <div className="v4-landing-practice-test-0">
                        <h2>{`Take Full ${appInfo.appName} Practice Test`}</h2>
                        <TestBanner appInfo={appInfo} test={tests[0]} />
                    </div>
                    <div className="v4-landing-banner-download-app-0">
                        <h2>{`Prepare to Pass ${isDesktop ? appInfo.appName : ""} on Any Devices`}</h2>
                        <BannerDownloadApp appInfo={appInfo} device={isDesktop ? "desktop" : "mobile"} />
                    </div>
                    <div className="v4-landing-seo-content-0">
                        <SeoContentComponentV2 homeSeoContent={homeSeoContent} />
                    </div>
                </MyContainer>
            </div>
        </Layout2>
    );
};

export default HomeSingleApp;
