import ParentAppLayout from "@/container/parent-app/ParentAppLayout";
import SeoHeader from "@/components/seo/SeoHeader";
import { isParentApp, isWebASVAB } from "@/config/config_web";
import { AppInfo, IAppInfo } from "@/models/AppInfo";
// import TestInfo, { ITestInfo } from "@/models/TestInfo";
// import { ITopic } from "@/models/Topic";
// import { getHomeSeoContentApi } from "@/services/home.service";
// import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { setScrollDownAuto } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo, readAllAppInfos } from "@/utils/getAppInfo";
import replaceYear from "@/utils/replaceYear";
import { GetStaticProps } from "next";
import { useEffect } from "react";

export default function Home({
    descriptionSEO,
    // listTopics,
    // tests,
    keywordSEO,
    appInfo,
    // homeSeoContent,
    titleSEO = "",
    listAppInfo,
}: {
    // listTopics?: ITopic[];
    // tests: ITestInfo[];
    keywordSEO: string;
    descriptionSEO: string;
    appInfo: IAppInfo;
    // homeSeoContent: string;
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
            {_isParentApp ? <ParentAppLayout appInfo={appInfo} listAppInfos={listAppInfo} /> : <></>}
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    const isAsvab = isWebASVAB();
    // let listTopics = []; // topics
    let appInfo: IAppInfo | null = getAppInfo();
    // let tests = []; // tests
    // let homeSeoContent;
    let listAppInfo = [];
    let _isParentApp = isParentApp();
    if (_isParentApp) {
        listAppInfo = readAllAppInfos();
        listAppInfo = listAppInfo.filter((w: any) => w.appId).map((w: any) => new AppInfo(w));
    } else {
        if (isAsvab) {
            // làm giao diện mới cho asvab nên check riêng asvab
            if (appInfo) {
                // let appData: any = await readFileAppFromGoogleStorage(appInfo.appId + "");
                // listTopics = appData?.topics ?? [];
                // listTopics.sort((a: any, b: any) => {
                //     return a.name.localeCompare(b.name);
                // });
                // let _tests = appData?.fullTests ?? [];
                // tests = _tests.map((t: any) => new TestInfo(t));
            }
            // homeSeoContent = await getHomeSeoContentApi("home-seo-content");
        }
    }

    // if (homeSeoContent) {
    //     homeSeoContent.content = replaceYear(homeSeoContent.content);
    // }
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
            // listTopics,
            // tests: tests,
            keywordSEO: appInfo?.keywordSEO,
            appInfo,
            // homeSeoContent,
            listAppInfo,
        },
    });
};
