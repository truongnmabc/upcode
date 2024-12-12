import React, { Fragment } from "react";
import MyContainer from "@/components/v4-material/MyContainer";
import { stateName } from "./HomeSingleApp";
import GridTopic from "@/components/homepage/GridTopic";
import { useMediaQuery } from "@mui/material";
import TestBanner from "@/components/homepage/TestBanner";
import BannerDownloadApp from "@/components/homepage/BannerDownloadApp";
import SeoContentComponentV2 from "@/components/seo";
import SelectState from "./newHome/selectState";
import ListHome from "./newHome/list/list";
import { ITestInfo } from "@/models/TestInfo";
import { IAppInfo } from "@/models/AppInfo";
import { ITopic } from "@/models/Topic";
import dynamic from "next/dynamic";
import BannerHome from "./newHome/banner";
import Handbook from "./newHome/handBook";
import { IItemBlock } from "@/pages/stateAndChildrenApp/[...stateAndChildrenApp]";
const ListBlock = dynamic(() => import("./newHome/slider"));

const listImg = {
    "general-knowledge": {
        lear: "/images/cdl_v2/home/1.png",
        test: "/images/cdl_v2/home/1.1.png",
    },
    hazmat: {
        lear: "/images/cdl_v2/home/4.png",
        test: "/images/cdl_v2/home/4.1.png",
    },
    "passenger-vehicles": {
        lear: "/images/cdl_v2/home/5.png",
        test: "/images/cdl_v2/home/5.1.png",
    },
    "air-brakes": {
        lear: "/images/cdl_v2/home/2.png",
        test: "/images/cdl_v2/home/2.1.png",
    },
    "combination-vehicles": {
        lear: "/images/cdl_v2/home/3.png",
        test: "/images/cdl_v2/home/3.1.png",
    },
    "doubles-triples-trailers": {
        lear: "/images/cdl_v2/home/7.png",
        test: "/images/cdl_v2/home/7.1.png",
    },
    "tanker-vehicles": {
        lear: "/images/cdl_v2/home/8.png",
        test: "/images/cdl_v2/home/8.1.png",
    },
    "school-bus": {
        lear: "/images/cdl_v2/home/6.png",
        test: "/images/cdl_v2/home/6.1.png",
    },
    "pre-trip-inspection": {
        lear: "/images/cdl_v2/home/9.png",
        test: "/images/cdl_v2/home/9.1.png",
    },
};

const NewHome = ({
    appInfo,
    listTopics,
    _state,
    tests,
    listBlock,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    tests: ITestInfo[];
    _state: string;
    listBlock?: IItemBlock[];
}) => {
    const isDesktop = useMediaQuery("(min-width:769px)");

    return (
        <div className="w-full h-full">
            <SelectState appInfo={appInfo} _state={_state} />
            <div
                style={{
                    background: "linear-gradient(180deg, #E5E9FF 0%, #F0F2FE 4.75%)",
                }}
            >
                <MyContainer>
                    <div className="landing-title-0">
                        <div className="landing-title-11">
                            <h2 className="title-h1">
                                <span className="text-2xl sm:text-[40px] font-bold sm:leading-[60px]">{`${_state} ${appInfo?.appName} Practice Test`}</span>
                                {/* <span className="landing-title-22">
                                Ace The <strong className="v4-font-semi-bold">{appInfo?.appName}</strong> On First Try
                            </span> */}
                            </h2>
                        </div>
                        <div className="landing-title-12">
                            <span className="text-base font-normal text-center">
                                Ace all {_state} DMV written tests with our two powerful systems: {isDesktop && <br />}
                                Master part by part in <span className="font-semibold">Practice mode</span> and experience the
                                real test atmosphere in <span className="font-semibold">Test mode</span>
                            </span>
                        </div>
                    </div>
                    <ListHome
                        appInfo={appInfo}
                        _state={_state}
                        listTopics={listTopics.map((item) => ({
                            ...item,
                            img: listImg[item.tag].lear,
                        }))}
                        tests={tests.map((item) => ({
                            ...item,
                            img: listImg[item.tag].test,
                        }))}
                    />
                </MyContainer>
                <ListBlock appInfo={appInfo} _state={_state} listBlock={listBlock} />
                <BannerHome appInfo={appInfo} _state={_state} />
                <Handbook appInfo={appInfo} _state={_state} />
            </div>
        </div>
    );
};

export default NewHome;
