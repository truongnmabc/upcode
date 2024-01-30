import { APP_SHORT_NAME } from "@/config_app";
import TestInfo, { ITestInfo } from "@/models/TestInfo";
import StoreProvider from "@/redux/StoreProvider";
import { getHomeSeoContentStateApi } from "@/services/home.service";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import IWebData from "@/types/webData";
import { getLink, getTitle } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { genFullStudyLink, genStudyLink, getAppShortName } from "@/utils/getStudyLink";
import replaceYear from "@/utils/replaceYear";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { SYNC_TYPE } from "../../config/config_sync";
import { isParentApp } from "../../config/config_web";
import { default as listAppTopics } from "../../data/studyData.json";
import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { getAppInfo, readAllAppInfos } from "../../utils/getAppInfo";
import Config from "@/config";
const ScrollToTopArrow = dynamic(() => import("../../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
const SeoHeader = dynamic(() => import("@/components/seo/SeoHeader"));
const SEO = dynamic(() => import("@/components/seo/SEO"));
const HomeSingleApp = dynamic(() => import("@/container/single-app/HomeSingleApp"));
const StudyLayout = dynamic(() => import("../../container/study/StudyLayout"));

const StudyPage = ({
    childrenApp,
    study,
}: {
    childrenApp: {
        listTopics?: ITopic[];
        tests?: ITestInfo[];
        keywordSEO: string;
        descriptionSEO: string;
        childAppInfo: IAppInfo;
        // homeSeoContent: string;
        titleSEO?: string;
    };
    study: {
        appInfo: IAppInfo;
        topic: IWebData;
        titleSEO: string;
        descriptionSEO: string;
        keywordSEO: string;
        gameType: -1 | 0 | 1;
    };
}) => {
    const router = useRouter();
    if (!!childrenApp) {
        const { descriptionSEO, listTopics, tests, keywordSEO, childAppInfo, titleSEO } = childrenApp;
        // appInfo ở đây là của app con nha
        return (
            <>
                <SeoHeader title={titleSEO} description={descriptionSEO} keyword={keywordSEO} />
                <StoreProvider appInfo={childAppInfo} webData={{ tests: tests, topics: listTopics }} />
                <HomeSingleApp appInfo={childAppInfo} homeSeoContent={""} listTopics={listTopics} tests={tests} />
                <ScrollToTopArrow />
            </>
        );
    } else if (!!study) {
        const { appInfo, topic, titleSEO, descriptionSEO, keywordSEO, gameType } = study;
        let webData = {
            appId: appInfo.appId,
            type: SYNC_TYPE.TYPE_LEARN_TEST,
            slug: router.asPath.slice(1, router.asPath.length), // mô tả tại IWebData, trong asPath có phần #level, slice để bỏ đi dấu / ở đầu vì trước dùng slug của getServerSideProps không có
            content: topic.content,
            title: topic.title,
            gameType,
        };
        return (
            <>
                <SEO
                    appInfo={appInfo}
                    addMathJax={appInfo.usingMathJax || true}
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
        let appData = listAppTopics.find((t) => t.appId === appInfo.appId);
        let _topics = appData.topics;
        _topics.forEach((t) => {
            paths.push(formatData(t.url)); // trong này có cả branch và topic luôn
        });
        let fullTestUrl = genFullStudyLink(appInfo);
        paths.push(formatData(fullTestUrl));
        return { paths, fallback: false };
    }
};

const formatData = (url: string) => {
    return {
        params: {
            studyOrChildrenApp: url.replaceAll("/", ""),
        },
    };
};
export const getStaticProps: GetStaticProps = async (context) => {
    let slug = context.params.studyOrChildrenApp as string;
    let _isParentApp = isParentApp();
    if (_isParentApp) {
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
        // for (let bucket of buckets) {
        //     try {
        //         let appData: any = await readFileAppFromGoogleStorage(bucket);
        //         listTopics = appData?.topics ?? [];
        //         console.log(
        //             JSON.stringify({
        //                 topics: listTopics.map((t) => ({ title: t.name, url: genStudyLink(childAppInfo, t.tag, bucket) })),
        //                 fullTests: [genStudyLink(childAppInfo, "", bucket)],
        //             }).replaceAll("/", "")
        //         );
        //     } catch (e) {
        //         console.log("error");
        //     }
        // }

        return convertToJSONObject({
            props: {
                childrenApp: {
                    titleSEO: titleSEO,
                    descriptionSEO: childAppInfo?.descriptionSEO,
                    listTopics,
                    tests: tests,
                    keywordSEO: childAppInfo?.keywordSEO,
                    childAppInfo,
                    // homeSeoContent,
                },
            },
        });
    } else {
        let appInfo = getAppInfo();
        let topics = listAppTopics.find((app) => app.appId === appInfo.appId).topics;
        const topic = topics.find((topic) => topic.url === slug); // chắc chắn có giá trị vì url đã được xác định từ getStaticPaths
        const contentSEO = await getHomeSeoContentStateApi(slug);
        if (contentSEO) {
            contentSEO.content = replaceYear(contentSEO.content);
        }
        let titleSEO = contentSEO?.titleSeo?.length > 0 ? contentSEO.titleSeo[0] : appInfo.title;
        let descriptionSEO = contentSEO?.descSeo?.length > 0 ? contentSEO.descSeo[0] : appInfo.descriptionSEO;
        // ở đây có thể xác định được gameType luôn
        let gameType = Config.TEST_GAME;
        if (!!topic) {
            if (topic.isBranch) gameType = Config.BRANCH_TEST_GAME;
            else gameType = Config.TOPIC_GAME;
        }
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
                    gameType,
                },
            },
        });
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
