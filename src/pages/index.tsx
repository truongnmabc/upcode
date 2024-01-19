import SeoHeader from "@/components/seo/SeoHeader";
import { isParentApp, isWebASVAB } from "@/config/config_web";
import { AppInfo, IAppInfo } from "@/models/AppInfo";
import TestInfo, { ITestInfo } from "@/models/TestInfo";
import { ITopic } from "@/models/Topic";
import { getHomeSeoContentApi } from "@/services/home.service";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { setScrollDownAuto } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo, readAllAppInfos } from "@/utils/getAppInfo";
import replaceYear from "@/utils/replaceYear";
import { GetStaticProps } from "next";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAppInfo } from "@/redux/features/appInfo";
import StoreProvider from "@/redux/StoreProvider";
import { getTopicByParentIdSuccess } from "@/redux/features/topic";
import { getTestSuccess } from "@/redux/features/test";
const HomeSingleApp = dynamic(() => import("@/container/single-app/HomeSingleApp"));
const ParentAppLayout = dynamic(() => import("@/container/parent-app/ParentAppLayout"));

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
    tests: ITestInfo[];
    keywordSEO: string;
    descriptionSEO: string;
    appInfo: IAppInfo;
    homeSeoContent: string;
    titleSEO?: string;
    listAppInfo: IAppInfo[];
}) {
    const _isParentApp = isParentApp();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setAppInfo(appInfo));
        setScrollDownAuto("home");
        if (listTopics.length > 0) {
            // cẩn thận điều kiện
            dispatch(getTopicByParentIdSuccess(listTopics)); // chỉ là để update vào redux thôi
        }
        if (tests.length) {
            // cẩn thận điều kiện
            dispatch(getTestSuccess(tests));
        }
    }, [dispatch]);
    let topics = useAppSelector((state) => state.topicReducer);
    // console.log(topics);

    return (
        <>
            <SeoHeader title={titleSEO} description={descriptionSEO} keyword={keywordSEO} />
            <StoreProvider />
            {_isParentApp ? (
                <ParentAppLayout appInfo={appInfo} listAppInfos={listAppInfo} />
            ) : (
                <HomeSingleApp appInfo={appInfo} homeSeoContent={homeSeoContent} listTopics={listTopics} tests={tests} />
            )}
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
        if (isAsvab) {
            // làm giao diện mới cho asvab nên check riêng asvab
            if (appInfo) {
                let appData: any = await readFileAppFromGoogleStorage(appInfo.appId + "");
                listTopics = appData?.topics ?? [];
                listTopics.sort((a: any, b: any) => {
                    return a.name.localeCompare(b.name);
                });
                let _tests = appData?.fullTests ?? [];
                tests = _tests.map((t: any) => new TestInfo(t));
            }
            homeSeoContent = await getHomeSeoContentApi("home-seo-content");
        }
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
