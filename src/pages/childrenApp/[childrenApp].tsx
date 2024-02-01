import TestInfo, { ITestInfo } from "@/models/TestInfo";
import StoreProvider from "@/redux/StoreProvider";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { getLink } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { genFullStudyLink } from "@/utils/getStudyLink";
import replaceYear from "@/utils/replaceYear";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { isParentApp } from "../../config/config_web";
import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { getAppInfo, readAllAppInfos } from "../../utils/getAppInfo";
const ScrollToTopArrow = dynamic(() => import("../../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
const SeoHeader = dynamic(() => import("@/components/seo/SeoHeader"));
const HomeSingleApp = dynamic(() => import("@/container/single-app/HomeSingleApp"));

const ChildrenApp = ({
    listTopics,
    tests,
    keywordSEO,
    descriptionSEO,
    childAppInfo,
    // homeSeoContent,
    titleSEO,
}: {
    listTopics?: ITopic[];
    tests?: ITestInfo[];
    keywordSEO: string;
    descriptionSEO: string;
    childAppInfo: IAppInfo;
    // homeSeoContent: string;
    titleSEO?: string;
}) => {
    // appInfo ở đây là của app con nha
    return (
        <>
            <SeoHeader title={titleSEO} description={descriptionSEO} keyword={keywordSEO} />
            <StoreProvider appInfo={childAppInfo} webData={{ tests: tests, topics: listTopics }} />
            <HomeSingleApp appInfo={childAppInfo} homeSeoContent={""} listTopics={listTopics} tests={tests} />
            <ScrollToTopArrow />
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const appInfo: IAppInfo | null = getAppInfo();
    if (!appInfo)
        return {
            paths: [],
            fallback: false, // false | true | 'blocking'
        };
    let _isParentApp = isParentApp();
    const paths = [];
    if (_isParentApp) {
        let listAppInfo = readAllAppInfos();
        listAppInfo = listAppInfo.filter((w: any) => w.appId && w.categoryId).map((w: any) => new AppInfo(w));
        let listAppLink: string[] = listAppInfo
            .map((app) => {
                let url = getLink(app, "");
                if (url.includes("https:")) return null;
                return formatData(url);
            })
            .filter((p) => p);
        paths.push(...listAppLink);
        return {
            paths,
            fallback: false,
        };
    }
};

const formatData = (url: string) => {
    return {
        params: {
            childrenApp: url.replaceAll("/", ""),
        },
    };
};
export const getStaticProps: GetStaticProps = async (context) => {
    // trang giao diện các chứng chỉ con, được định tuyến trong exportPathMap tại next.config.js
    let slug = context.params.childrenApp as string;
    // vaof app con, làm tương tự như ở /pages/index.tsx
    let listTopics = []; // topics
    let tests = []; // tests
    // let homeSeoContent;
    let listAppInfos = readAllAppInfos();
    let childAppInfo = listAppInfos.find((a) => {
        return slug === getLink(a).replaceAll("/", "");
    });
    if (childAppInfo) {
        // let _APP_SHORT_NAME = getAppShortName(childAppInfo.appShortName);
        let appData: any = await readFileAppFromGoogleStorage(childAppInfo.bucket.toLowerCase());
        listTopics = appData?.topics ?? [];
        listTopics.sort((a: any, b: any) => {
            return a.name.localeCompare(b.name);
        });
        let _tests = appData?.fullTests ?? [];
        tests = _tests.map((t: any) => new TestInfo({ ...t, slug: genFullStudyLink(childAppInfo) }));
    }
    // homeSeoContent = await getHomeSeoContentApi("home-seo-content");
    // if (homeSeoContent) {
    //     homeSeoContent.content = replaceYear(homeSeoContent.content);
    // }
    let rankMathTitle = childAppInfo?.rank_math_title;
    if (childAppInfo && rankMathTitle) {
        rankMathTitle = rankMathTitle?.replace("%title%", childAppInfo.title).replace("%page%", "");
        rankMathTitle = replaceYear(rankMathTitle);
    }
    let titleSEO = !!rankMathTitle ? rankMathTitle : childAppInfo?.title;
    if (titleSEO) titleSEO = replaceYear(titleSEO);

    // let buckets = ["accuplacer", "apsychology", "apush", "ase", "asvab", "aws", "ccsp", "ceh", "comptiaa"];
    // let r = "[";
    // for (let app of listAppInfos) {
    //     let bucket = app.bucket;
    //     try {
    //         let appData: any = await readFileAppFromGoogleStorage(bucket);
    //         listTopics = appData?.topics ?? [];
    //         r +=
    //             JSON.stringify({
    //                 appId: app.appId,
    //                 topics: listTopics.map((t) => ({ title: t.name, url: genStudyLink(app.appShortName, t.tag) })),
    //                 fullTests: [genStudyLink(app.appShortName, "")],
    //             }).replaceAll("/", "") + ",";
    //     } catch (e) {
    //         console.log("error", bucket);
    //     }
    // }
    // r += "]";
    // console.log(r);

    return convertToJSONObject({
        props: {
            titleSEO: titleSEO,
            descriptionSEO: childAppInfo?.descriptionSEO,
            listTopics,
            tests: tests,
            keywordSEO: childAppInfo?.keywordSEO,
            childAppInfo,
            // homeSeoContent,
        },
    });
};

export default ChildrenApp;
