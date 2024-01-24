import { useEffect } from "react";
import SEO from "../../components/seo/SEO";
import { SYNC_TYPE } from "../../config/config_sync";
import { isParentApp, isWebASVAB } from "../../config/config_web";
import StudyLayout from "../../container/study/StudyLayout";
import listAppTopics from "../../data/topic-landing-page.json";
import * as ga from "../../services/ga";
import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { getAppInfo, readAllAppInfos } from "../../utils/getAppInfo";
import { useRouter } from "next/router";
import AppState from "@/redux/appState";
import { useAppSelector } from "@/redux/hooks";
import IWebData from "@/types/webData";
import replaceYear from "@/utils/replaceYear";
import convertToJSONObject from "@/utils/convertToJSONObject";
import StoreProvider from "@/redux/StoreProvider";
import { getHomeSeoContentApi, getHomeSeoContentStateApi } from "@/services/home.service";
import { getLink, getTitle } from "@/utils";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import listAppTopic from "../../data/topic-landing-page.json";
import { APP_SHORT_NAME } from "@/config_app";
import TestInfo, { ITestInfo } from "@/models/TestInfo";
import SeoHeader from "@/components/seo/SeoHeader";
import HomeSingleApp from "@/container/single-app/HomeSingleApp";
const ScrollToTopArrow = dynamic(() => import("../../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
const StudyPage = ({
    childrenApp,
    study,
}: {
    childrenApp: {
        listTopics?: ITopic[];
        tests?: ITestInfo[];
        keywordSEO: string;
        descriptionSEO: string;
        appInfo: IAppInfo;
        // homeSeoContent: string;
        titleSEO?: string;
    };
    study: {
        appInfo: IAppInfo;
        topic: IWebData;
        titleSEO: string;
        descriptionSEO: string;
        keywordSEO: string;
    };
}) => {
    const router = useRouter();
    if (!!childrenApp) {
        const { descriptionSEO, listTopics, tests, keywordSEO, appInfo, titleSEO } = childrenApp;
        return (
            <>
                <SeoHeader title={titleSEO} description={descriptionSEO} keyword={keywordSEO} />
                <StoreProvider appInfo={appInfo} webData={{ tests: tests, topics: listTopics }} />
                <HomeSingleApp appInfo={appInfo} homeSeoContent={""} listTopics={listTopics} tests={tests} />
            </>
        );
    } else if (!!study) {
        const { appInfo, topic, titleSEO, descriptionSEO, keywordSEO } = study;
        let webData = {
            appId: appInfo.appId,
            type: SYNC_TYPE.TYPE_LEARN_TEST,
            slug: router.asPath.slice(1, router.asPath.length), // mô tả tại IWebData, trong asPath có phần #level, slice để bỏ đi dấu / ở đầu vì trước dùng slug của getServerSideProps không có
            content: topic.content,
            isBranch: topic.isBranch,
            title: topic.title,
        };
        return (
            <>
                <SEO
                    appInfo={appInfo}
                    addMathJax={appInfo.usingMathJax}
                    title={titleSEO}
                    descriptionSEO={descriptionSEO}
                    keywordsSeo={keywordSEO}
                ></SEO>
                <StoreProvider appInfo={appInfo} webData={webData} />
                <StudyLayout appInfo={appInfo} contentData={webData} />
                <ScrollToTopArrow />
            </>
        );
    }
    return <>Error!</>;
    // const router = useRouter();
    // useEffect(() => {
    //     if (window) {
    //         ga.event({
    //             action: "users_exclude_blog",
    //             params: { from: window.location.href },
    //         });
    //     }
    // }, []);
    // if (isWebASVAB()) {
    //     let webData = {
    //         appId: appInfo.appId,
    //         type: SYNC_TYPE.TYPE_LEARN_TEST,
    //         slug: router.asPath.slice(1, router.asPath.length), // mô tả tại IWebData, trong asPath có phần #level, slice để bỏ đi dấu / ở đầu vì trước dùng slug của getServerSideProps không có
    //         content: topic.content,
    //         isBranch: topic.isBranch,
    //         title: topic.title,
    //     };
    //     return (
    //         <>
    //             <SEO
    //                 appInfo={appInfo}
    //                 addMathJax={appInfo.usingMathJax}
    //                 title={titleSEO}
    //                 descriptionSEO={descriptionSEO}
    //                 keywordsSeo={keywordSEO}
    //             ></SEO>
    //             <StoreProvider appInfo={appInfo} webData={webData} />
    //             <StudyLayout appInfo={appInfo} contentData={webData} />
    //             <ScrollToTopArrow />
    //         </>
    //     );
    // }
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
    } else {
        let appData = listAppTopic.find((t) => t.appName === APP_SHORT_NAME);
        let _topics = appData.topics;
        paths.push({});
        _topics.forEach((t) => {
            paths.push(formatData(t.url)); // trong này có cả branch và topic luôn
        });
        return { paths, fallback: false };
    }
};

const formatData = (url: string) => {
    return {
        params: {
            study: url.replaceAll("/", ""),
        },
    };
};
export const getStaticProps: GetStaticProps = async (context) => {
    let slug = context.params.study as string;
    try {
        let _isParentApp = isParentApp();
        if (_isParentApp) {
            // vaof app con, làm tương tự như ở /pages/index.tsx
            let listTopics = []; // topics
            let tests = []; // tests
            // let homeSeoContent;
            let listAppInfos = readAllAppInfos();
            let appInfo = listAppInfos.find((a) => {
                return slug === getLink(a).replaceAll("/", "");
            });
            // console.log(appInfo);
            if (appInfo) {
                let _APP_SHORT_NAME = appInfo.appShortName.toLowerCase().replaceAll(" ", "-").replaceAll("_", "-");
                let appData: any = await readFileAppFromGoogleStorage(_APP_SHORT_NAME);
                listTopics = appData?.topics ?? [];
                listTopics.sort((a: any, b: any) => {
                    return a.name.localeCompare(b.name);
                });
                let _tests = appData?.fullTests ?? [];
                tests = _tests.map((t: any) => new TestInfo(t));
            }
            // homeSeoContent = await getHomeSeoContentApi("home-seo-content");
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
                    childrenApp: {
                        titleSEO: titleSEO,
                        descriptionSEO: appInfo?.descriptionSEO,
                        listTopics,
                        tests: tests,
                        keywordSEO: appInfo?.keywordSEO,
                        appInfo,
                        // homeSeoContent,
                    },
                },
            });
        } else {
            let appInfo = getAppInfo();
            let topics = listAppTopics.find((app) => app.appName === APP_SHORT_NAME).topics;
            const topic = topics.find((topic) => topic.url === slug); // chắc chắn có giá trị vì url đã được xác định từ getStaticPaths
            const contentSEO = await getHomeSeoContentStateApi(slug);
            if (contentSEO) {
                contentSEO.content = replaceYear(contentSEO.content);
            }
            let titleSEO = contentSEO?.titleSeo?.length > 0 ? contentSEO.titleSeo[0] : appInfo.title;
            let descriptionSEO = contentSEO?.descSeo?.length > 0 ? contentSEO.descSeo[0] : appInfo.descriptionSEO;
            // if (topic || slug == "full-length-" + appInfo.appShortName + "-practice-test")
            return convertToJSONObject({
                props: {
                    study: {
                        appInfo,
                        titleSEO,
                        descriptionSEO,
                        keywordSEO: appInfo.keywordSEO,
                        topic: {
                            ...topic,
                            content: contentSEO?.content ?? "",
                            title: topic ? topic?.title : getTitle(appInfo),
                        },
                    },
                },
            });
        }
    } catch (err) {
        console.log("get Error when access " + slug);
        return { redirect: { destination: "/", permanent: false } };
    }
};
// export const getServerSideProps = async (context) => {
//     try {
//         const isAsvab = isWebASVAB();
//         let slug = context.params.study;
//         let appInfo: IAppInfo | null = getAppInfo();
//         const appName = appInfo.appShortName;
//         let topics = listAppTopics.find((app) => app.appName === appName).topics;
//         const topic = topics.find((topic) => topic.url === slug);

//         const contentSEO = await getHomeSeoContentStateApi(slug, context.req.host);
//         if (contentSEO) {
//             contentSEO.content = replaceYear(contentSEO.content);
//         }
//         let titleSEO = contentSEO?.titleSeo?.length > 0 ? contentSEO.titleSeo[0] : appInfo.title;
//         let descriptionSEO = contentSEO?.descSeo?.length > 0 ? contentSEO.descSeo[0] : appInfo.descriptionSEO;
//         if (isAsvab) {
//             if (topic || slug == "full-length-" + appInfo.appShortName + "-practice-test") {
//                 // đúng đường dẫn
//                 // quy định full-length-[APP_SHORT_NAME]-practice-test là vào phần test
//                 return convertToJSONObject({
//                     props: {
//                         appInfo,
//                         titleSEO,
//                         descriptionSEO,
//                         keywordSEO: appInfo.keywordSEO,
//                         topic: {
//                             ...topic,
//                             content: contentSEO?.content ?? "",
//                             title: topic ? topic?.title : getTitle(appInfo),
//                         },
//                     },
//                 });
//             } else throw {};
//         }
//         return { props: {} };
//     } catch (error) {
//         context.res.writeHead(302, { Location: "/" }).end();
//         return { props: {} };
//     }
// };

export default StudyPage;
