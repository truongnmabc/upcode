import React, { useEffect } from "react";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { ITestInfo } from "../../models/TestInfo";
import * as ga from "../../services/ga";
import useMediaQuery from "@mui/material/useMediaQuery";
import Layout2 from "@/components/layout/layout-2/Layout2";
import TestBanner from "@/components/homepage/TestBanner";
import BannerDownloadApp from "@/components/homepage/BannerDownloadApp";
import SeoContentComponentV2 from "@/components/seo";
import MyContainer from "@/components/v4-material/MyContainer";
import "./HomeSingleApp.scss";
import GridTopic from "@/components/homepage/GridTopic";
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
    useEffect(() => {
        if (window) {
            ga.event({
                action: "home_users",
                params: { from: window.location.href },
            });
            ga.event({
                action: "users_exclude_blog",
                params: { from: window.location.href },
            });
        }
    }, []);
    const isDesktop = useMediaQuery("(min-width:769px)");
    return (
        <Layout2 appInfo={appInfo} listTopics={listTopics} tests={tests}>
            <div className="v4-home-landing-0">
                <MyContainer>
                    <div className="landing-title-0">
                        <div className="landing-title-11">
                            <h1 className="title-h1">
                                <span className="landing-title-21">{appInfo?.appName + " Practice Test"}</span>{" "}
                                <span className="landing-title-22">
                                    Ace The <strong className="v4-font-semi-bold">{appInfo?.appName}</strong> On First Try
                                </span>
                            </h1>
                        </div>
                        <div className="landing-title-12">
                            {listTopics.length > 1
                                ? `Our free ${appInfo.appName} practice tests feature all ${appInfo.appName} test subjects. We recommend taking at least one practice exam from every subject to guarantee your success at your local testing location. To get started, choose a category from the list below and practice them!`
                                : `Our free ${appInfo.appName} practice tests feature all ${appInfo.appName} test subjects. We recommend taking all practice questions to guarantee your success at your local testing location.`}
                        </div>
                    </div>
                    <div className="v4-landing-topic-0">
                        <h2>{`Practice ${appInfo.appName} Test By Topics`}</h2>
                        <GridTopic place="home" listTopics={listTopics} appInfo={appInfo} allowExpand={!isDesktop} />
                    </div>

                    <div className="v4-landing-practice-test-0">
                        <h2>{`Take Full ${appInfo.appName} Practice Test`}</h2>
                        {tests.map((test, index) => (
                            <div key={index} style={{ marginTop: index != 0 ? 16 : 0 }}>
                                <TestBanner key={index} appInfo={appInfo} test={test} index={index} />
                            </div>
                        ))}
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
