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
import NewHome from "./newHome";
import { IItemBlock } from "@/pages/stateAndChildrenApp/[...stateAndChildrenApp]";
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
    listBlock,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    homeSeoContent: any;
    tests: ITestInfo[];
    _state: string;
    listBlock?: IItemBlock[];
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

    useEffect(() => {
        if (isDesktop) {
            let area = document.getElementById("app-state-backround-0");
            if (area) {
                if (openListState == 1) {
                    area.style.height = "735px";
                } else {
                    area.style.height = "400px";
                }
            }
        }
    }, [openListState, isDesktop]);
    return (
        <Layout2 appInfo={appInfo} listTopics={listTopics} tests={tests}>
            <div className="v4-home-landing-0">
                {appHasState && !!!_state ? (
                    <>
                        <div className="app-state-backround-0" id="app-state-backround-0">
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
                                                ga.event({ action: "click_go_to_state", params: { app: appInfo.appName } });
                                            } else {
                                                if (openListState != 1) setOpenListState(1);
                                                ga.event({ action: "click_get_started", params: { app: appInfo.appName } });
                                            }
                                        }}
                                    >
                                        {currentState ? `Go To ${currentState.replaceAll("-", " ")}` : "Get Started"}
                                    </div>
                                    {!!currentState && openListState < 1 && (
                                        <div
                                            className="not-your-state"
                                            onClick={() => {
                                                setOpenListState(1);
                                                ga.event({ action: "select_another_state", params: { app: appInfo.appName } });
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
                    <NewHome
                        listTopics={listTopics}
                        tests={tests}
                        _state={stateName(_state)}
                        appInfo={appInfo}
                        // homeSeoContent={homeSeoContent}
                        listBlock={listBlock}
                    />
                )}
            </div>
        </Layout2>
    );
};

export const stateName = (state: string) => {
    return capitalizeFirstWord(state.replaceAll("-", " "));
};
export default HomeSingleApp;
