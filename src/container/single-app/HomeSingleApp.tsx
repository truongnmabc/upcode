import React, { useEffect, useState } from "react";
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
import dynamic from "next/dynamic";
import { capitalizeFirstWord, getLink } from "@/utils";
const ListState = dynamic(() => import("../../components/homepage/ListState"), {
    ssr: false,
    // loading: () => <div className="v4-border-radius" style={{ height: "16px", background: "#212121b2" }} />,
});

const HomeSingleApp = ({
    appInfo,
    listTopics,
    homeSeoContent,
    tests,
    _state = "",
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    homeSeoContent: any;
    tests: ITestInfo[];
    _state: string;
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
    const appHasState = appInfo.hasState;
    const [openListState, setOpenListState] = useState(-1);
    const [currentState, setCurrentState] = useState("");
    useEffect(() => {
        let _state = localStorage.getItem("select-state-" + appInfo.appNameId);
        if (_state) {
            setCurrentState(_state);
        }
    }, [appInfo]);
    return (
        <Layout2 appInfo={appInfo} listTopics={listTopics} tests={tests}>
            <div className="v4-home-landing-0">
                {appHasState && !!!_state ? (
                    <>
                        <div className="app-state-backround-0">
                            <MyContainer>
                                <div className="landing-title-0">
                                    <div className="landing-title-11">
                                        <h1 className="title-h1">
                                            <span className="landing-title-21">{appInfo?.appName + " Practice Test"}</span>
                                            <span className="landing-title-22">
                                                Ace The <strong className="v4-font-semi-bold">{appInfo?.appName}</strong> On
                                                First Try
                                            </span>
                                        </h1>
                                    </div>
                                    <div
                                        className="get-started-btn v4-border-radius"
                                        onClick={() => {
                                            if (currentState) {
                                                window.location.href = getLink(appInfo, currentState);
                                            } else if (openListState != 1) setOpenListState(1);
                                        }}
                                    >
                                        {currentState ? `Go To ${currentState.replaceAll("-", " ")}` : "Get Started"}
                                    </div>
                                    {!!currentState && openListState < 1 && (
                                        <div
                                            className="not-your-state"
                                            onClick={() => {
                                                setOpenListState(1);
                                            }}
                                        >
                                            Not your state?
                                        </div>
                                    )}
                                    {openListState == 1 && (
                                        <ListState
                                            appInfo={appInfo}
                                            isDesktop={isDesktop}
                                            openListState={openListState}
                                            setOpenListState={setOpenListState}
                                        />
                                    )}
                                </div>
                            </MyContainer>
                        </div>
                        <MyContainer>
                            <div className="v4-landing-banner-download-app-0">
                                <h2>{`Prepare to Pass ${isDesktop ? appInfo.appName : ""} on Any Devices`}</h2>
                                <BannerDownloadApp appInfo={appInfo} device={isDesktop ? "desktop" : "mobile"} />
                            </div>
                            <div className="v4-landing-seo-content-0">
                                <SeoContentComponentV2 homeSeoContent={homeSeoContent} />
                            </div>
                        </MyContainer>
                    </>
                ) : (
                    <MyContainer>
                        <div className="landing-title-0">
                            <div className="landing-title-11">
                                <h1 className="title-h1">
                                    <span className="landing-title-21">{`${stateName(_state)} ${
                                        appInfo?.appName
                                    } Practice Test`}</span>
                                    <span className="landing-title-22">
                                        Ace The <strong className="v4-font-semi-bold">{appInfo?.appName}</strong> On First Try
                                    </span>
                                </h1>
                            </div>
                            <div className="landing-title-12">
                                {listTopics.length > 1
                                    ? `Our free ${stateName(_state)} ${appInfo.appName} practice tests feature all ${stateName(
                                          _state
                                      )} ${
                                          appInfo.appName
                                      } test subjects. We recommend taking at least one practice exam from every subject to guarantee your success at your local testing location. To get started, choose a category from the list below and practice them!`
                                    : `Our free ${stateName(_state)} ${appInfo.appName} practice tests feature all ${stateName(
                                          _state
                                      )} ${
                                          appInfo.appName
                                      } test subjects. We recommend taking all practice questions to guarantee your success at your local testing location.`}
                            </div>
                        </div>
                        <div className="v4-landing-topic-0">
                            <h2>{`Practice ${stateName(_state)} ${appInfo.appName} Test By Topics`}</h2>
                            <GridTopic
                                place="home"
                                listTopics={listTopics}
                                appInfo={appInfo}
                                allowExpand={!isDesktop}
                                _state={_state}
                            />
                        </div>

                        <div className="v4-landing-practice-test-0">
                            <h2>{`Take Full ${stateName(_state)} ${appInfo.appName} Practice Test`}</h2>
                            {tests.map((test, index) => (
                                <div key={index} style={{ marginTop: index != 0 ? 16 : 0 }}>
                                    <TestBanner key={index} appInfo={appInfo} test={test} index={index} />
                                </div>
                            ))}
                        </div>
                        <div className="v4-landing-banner-download-app-0">
                            <h2>{`Prepare to Pass ${stateName(_state)} ${appInfo.appName} on Any Devices`}</h2>
                            <BannerDownloadApp appInfo={appInfo} device={isDesktop ? "desktop" : "mobile"} />
                        </div>
                        <div className="v4-landing-seo-content-0">
                            <SeoContentComponentV2 homeSeoContent={homeSeoContent} />
                        </div>
                    </MyContainer>
                )}
            </div>
        </Layout2>
    );
};

const stateName = (state: string) => {
    return capitalizeFirstWord(state.replaceAll("-", " "));
};
export default HomeSingleApp;
