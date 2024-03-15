import SeoHeader from "@/components/seo/SeoHeader";
import { isParentApp } from "@/config/config_web";
import { AppInfo, IAppInfo } from "@/models/AppInfo";
import { ITestInfo } from "@/models/TestInfo";
import { ITopic } from "@/models/Topic";
import StoreProvider from "@/redux/StoreProvider";
import { callApi } from "@/services";
import { getHomeSeoContentApi } from "@/services/home.service";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { setScrollDownAuto } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo, readAllAppInfos } from "@/utils/getAppInfo";
import replaceYear from "@/utils/replaceYear";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import stateData from "../data/statesName.json";
const HomeSingleApp = dynamic(() => import("@/container/single-app/HomeSingleApp"));
const ParentAppLayout = dynamic(() => import("@/container/parent-app/ParentAppLayout"));
const ScrollToTopArrow = dynamic(() => import("../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
export default function Home({
    descriptionSEO,
    listTopics,
    tests,
    keywordSEO,
    appInfo,
    homeSeoContent,
    titleSEO = "",
    listAppInfo,
}: {
    listTopics?: ITopic[];
    tests?: ITestInfo[];
    keywordSEO: string;
    descriptionSEO: string;
    appInfo: IAppInfo;
    homeSeoContent: string;
    titleSEO?: string;
    listAppInfo: IAppInfo[];
}) {
    const _isParentApp = isParentApp();
    useEffect(() => {
        setScrollDownAuto("home");
    }, []);

    return (
        <>
            <SeoHeader title={titleSEO} description={descriptionSEO} keyword={keywordSEO} ads />
            <StoreProvider appInfo={appInfo} webData={_isParentApp ? {} : { tests: tests, topics: listTopics }} />
            {/* <div
                style={{ marginTop: "100px" }}
                onClick={() => {
                    genState();
                }}
            >
                kkkkkkkkkkk
            </div> */}
            {_isParentApp ? (
                <ParentAppLayout appInfo={appInfo} listAppInfos={listAppInfo} />
            ) : (
                <HomeSingleApp
                    appInfo={appInfo}
                    homeSeoContent={homeSeoContent}
                    listTopics={listTopics}
                    tests={tests}
                    _state=""
                />
            )}
            <ScrollToTopArrow />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    let listTopics = []; // topics
    let appInfo: IAppInfo | null = getAppInfo();
    let tests = []; // tests
    let homeSeoContent;
    let listAppInfo = [];
    let _isParentApp = isParentApp();
    if (_isParentApp) {
        listAppInfo = readAllAppInfos();
        listAppInfo = listAppInfo.filter((w: any) => w.appId).map((w: any) => new AppInfo(w));
    } else {
        // làm giao diện mới cho asvab nên check riêng asvab
        if (appInfo) {
            let appData: any = await readFileAppFromGoogleStorage(appInfo);
            listTopics = appData?.topics ?? [];
            tests = appData?.fullTests ?? [];
        }
        homeSeoContent = await getHomeSeoContentApi("home-seo-content");
    }

    if (homeSeoContent) {
        homeSeoContent.content = replaceYear(homeSeoContent.content);
    }
    // let rankMathTitle = appInfo?.rank_math_title;
    // if (appInfo && rankMathTitle) {
    //     rankMathTitle = rankMathTitle?.replace("%title%", appInfo.title).replace("%page%", "");
    //     rankMathTitle = replaceYear(rankMathTitle);
    // }
    // let titleSEO = !!rankMathTitle ? rankMathTitle : appInfo?.title;
    let titleSEO = appInfo.title;
    if (titleSEO) titleSEO = replaceYear(titleSEO);
    return convertToJSONObject({
        props: {
            titleSEO: titleSEO,
            descriptionSEO: appInfo?.descriptionSEO,
            listTopics,
            tests: tests,
            keywordSEO: appInfo?.keywordSEO,
            appInfo,
            homeSeoContent,
            listAppInfo,
        },
    });
};
const genState = async () => {
    let states = stateData.cdl.slice(15, 25);
    for (let s of states) {
        try {
            setTimeout(() => {}, 1000);
            let res = await callApi({
                url: `api/app/export-data-web?stateId=${s.id}&appId=6540077669810176&bucket=cdl_v2&state=${s.tag}`,
                params: null,
                method: "get",
                baseURl: "http://localhost:3001/",
                headers: null,
                timeout: 90000,
            });
            console.log(s.name, res);
        } catch (e) {
            console.log("*****NOT*OK******", s.name);
        }
    }
    console.log("--------done-----------");
};
