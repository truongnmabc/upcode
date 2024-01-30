import Config from "@/config";
import StoreProvider from "@/redux/StoreProvider";
import { getHomeSeoContentStateApi } from "@/services/home.service";
import IWebData from "@/types/webData";
import { getLink, getTitle } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { genStudyLink, getAppShortName } from "@/utils/getStudyLink";
import replaceYear from "@/utils/replaceYear";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import SEO from "../../components/seo/SEO";
import { SYNC_TYPE } from "../../config/config_sync";
import { isParentApp } from "../../config/config_web";
import StudyLayout from "../../container/study/StudyLayout";
import { default as listAppTopics } from "../../data/studyData.json";
import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { getAppInfo, readAllAppInfos } from "../../utils/getAppInfo";
import { useEffect } from "react";
const ScrollToTopArrow = dynamic(() => import("../../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
const StudyPage = ({
    appInfo,
    topic,
    titleSEO,
    descriptionSEO,
    keywordSEO,
    gameType,
}: {
    appInfo: IAppInfo;
    topic: IWebData;
    titleSEO: string;
    descriptionSEO: string;
    keywordSEO: string;
    gameType: -1 | 0 | 1;
}) => {
    const router = useRouter();
    let _slug = router.asPath.slice(1, router.asPath.length); // mô tả tại IWebData, trong asPath có phần #level, slice để bỏ đi dấu / ở đầu vì trước dùng slug của getServerSideProps không có
    let webData = {
        appId: appInfo.appId,
        type: SYNC_TYPE.TYPE_LEARN_TEST,
        fullSlug: _slug,
        content: topic.content,
        title: topic.title,
        gameType,
        bucket: appInfo.bucket,
    };
    return (
        <>
            <SEO
                appInfo={appInfo}
                addMathJax={!!appInfo.usingMathJax || true}
                title={titleSEO}
                descriptionSEO={descriptionSEO}
                keywordsSeo={keywordSEO}
            ></SEO>
            <StoreProvider appInfo={appInfo} webData={webData} />
            <StudyLayout appInfo={appInfo} contentData={webData} />
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
        // gen link phần học của chứng chỉ trong app cha
        let listAppInfo: any[] = readAllAppInfos();
        listAppInfo = listAppInfo.filter((w: any) => w.appId && w.categoryId).map((w: any) => new AppInfo(w));
        listAppInfo.forEach((app) => {
            // duyệt từng chứng chỉ con
            let url = getLink(app, ""); // link của chứng chỉ
            if (url.includes("https:")) return null; // bỏ qua mấy app có link sang web riêng của nó
            // let _APP_SHORT_NAME = getAppShortName(app.appShortName);
            let appData = listAppTopics.find((t) => t.appId === app.appId); // tìm ds topic của app trong file data
            let _topics = appData?.topics ?? [];
            _topics.forEach((t) => {
                //trong này có cả branch và topic luôn
                // t.url PHẢI tương đương với genFullStudyLink(app, t.learnUrl)
                paths.push(formatData(url, t.url)); // /asvab-practice-test/topic-iii
            });
            let fullTestUrl = genStudyLink(app);
            paths.push(formatData(url, fullTestUrl));
        });
        return {
            paths,
            fallback: false,
        };
    }
    return {
        paths: [],
        fallback: false, // false | true | 'blocking'
    };
};

const formatData = (studyOrChildrenApp: string, slug: string) => {
    return {
        params: {
            studyOrChildrenApp: studyOrChildrenApp.replaceAll("/", ""),
            slug: [slug.replaceAll("/", "")],
        },
    };
};
export const getStaticProps: GetStaticProps = async (context) => {
    let studyOrChildrenApp = context.params.studyOrChildrenApp as string;
    let slug = context.params.slug[0];
    // asvab-practice-test : asvab-arithmetic-reasoning-practice-test
    let _isParentApp = isParentApp();
    if (_isParentApp) {
        // cần xác định đường link này ứng với chứng chỉ nào
        let listAppInfo: any[] = readAllAppInfos();
        listAppInfo = listAppInfo.map((app) => new AppInfo(app));
        let appInfo = listAppInfo.find((app) => getLink(app) === "/" + studyOrChildrenApp);
        if (!!appInfo) {
            let topics = listAppTopics.find((app) => app.appId === appInfo.appId)?.topics;
            const topic = topics?.find((topic) => topic.url === slug); // chắc chắn có giá trị vì url đã được xác định từ getStaticPaths
            const contentSEO = await getHomeSeoContentStateApi(slug);
            if (contentSEO) {
                contentSEO.content = replaceYear(contentSEO.content);
            }
            let titleSEO = contentSEO?.titleSeo?.length > 0 ? contentSEO.titleSeo[0] : appInfo.title;
            let descriptionSEO = contentSEO?.descSeo?.length > 0 ? contentSEO.descSeo[0] : appInfo.descriptionSEO;
            let gameType = Config.TEST_GAME;
            if (!!topic) {
                if (topic?.isBranch) gameType = Config.BRANCH_TEST_GAME;
                else gameType = Config.TOPIC_GAME;
            }
            return convertToJSONObject({
                props: {
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
            });
        } else throw { err: "Not defined app" };
    }
};

export default StudyPage;
