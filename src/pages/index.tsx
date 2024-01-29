import { AppInfo, IAppInfo } from "@/models/AppInfo";
import { getAppInfo, readAllAppInfos } from "@/utils/getAppInfo";
import { getHomeSeoContentApi } from "@/services/home.service";
import { GetStaticProps } from "next";
import { isParentApp, isWebASVAB } from "@/config/config_web";
import { ITopic } from "@/models/Topic";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { setScrollDownAuto } from "@/utils";
import { useEffect } from "react";
import convertToJSONObject from "@/utils/convertToJSONObject";
import dynamic from "next/dynamic";
import replaceYear from "@/utils/replaceYear";
import SeoHeader from "@/components/seo/SeoHeader";
import StoreProvider from "@/redux/StoreProvider";
import TestInfo, { ITestInfo } from "@/models/TestInfo";
import { APP_SHORT_NAME } from "@/config_app";
import { genFullStudyLink } from "@/utils/getStudyLink";
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
            <SeoHeader title={titleSEO} description={descriptionSEO} keyword={keywordSEO} />
            <StoreProvider appInfo={appInfo} webData={_isParentApp ? {} : { tests: tests, topics: listTopics }} />
            {_isParentApp ? (
                <ParentAppLayout appInfo={appInfo} listAppInfos={listAppInfo} />
            ) : (
                <HomeSingleApp appInfo={appInfo} homeSeoContent={homeSeoContent} listTopics={listTopics} tests={tests} />
            )}
            <ScrollToTopArrow />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    const isAsvab = isWebASVAB();
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
            let appData: any = await readFileAppFromGoogleStorage(APP_SHORT_NAME);
            listTopics = appData?.topics ?? [];
            listTopics.sort((a: any, b: any) => {
                return a.name.localeCompare(b.name);
            });
            let _tests = appData?.fullTests ?? [];
            tests = _tests.map((t: any) => new TestInfo({ ...t, slug: genFullStudyLink(appInfo) }));
        }
        homeSeoContent = await getHomeSeoContentApi("home-seo-content");
    }

    if (homeSeoContent) {
        homeSeoContent.content = replaceYear(homeSeoContent.content);
    }
    let rankMathTitle = appInfo?.rank_math_title;
    if (appInfo && rankMathTitle) {
        rankMathTitle = rankMathTitle?.replace("%title%", appInfo.title).replace("%page%", "");
        rankMathTitle = replaceYear(rankMathTitle);
    }
    let titleSEO = !!rankMathTitle ? rankMathTitle : appInfo?.title;
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
