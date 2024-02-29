import Config from "@/config";
import StoreProvider from "@/redux/StoreProvider";
import { getHomeSeoContentStateApi } from "@/services/home.service";
import IWebData from "@/types/webData";
import { getTitle } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import replaceYear from "@/utils/replaceYear";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { SYNC_TYPE } from "../../config/config_sync";
import { ITestInfo } from "@/models/TestInfo";
import { ITopic } from "@/models/Topic";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { IAppInfo } from "../../models/AppInfo";
import { getAppInfo } from "../../utils/getAppInfo";
import { useEffect } from "react";
import * as ga from "../../services/ga";
const ScrollToTopArrow = dynamic(() => import("../../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
const SEO = dynamic(() => import("@/components/seo/SEO"));
const StudyLayout = dynamic(() => import("../../container/study/StudyLayout"));

const StudyPage = ({
    appInfo,
    data,
    titleSEO,
    descriptionSEO,
    keywordSEO,
    gameType,
    topics,
    tests,
}: {
    appInfo: IAppInfo;
    data: IWebData;
    titleSEO: string;
    descriptionSEO: string;
    keywordSEO: string;
    gameType: -1 | 0 | 1;
    topics: ITopic[];
    tests: ITestInfo[];
}) => {
    const router = useRouter();
    let webData = {
        appId: appInfo.appId,
        type: SYNC_TYPE.TYPE_LEARN_TEST,
        fullSlug: router.asPath.slice(1, router.asPath.length), // mô tả tại IWebData, trong asPath có phần #level, slice để bỏ đi dấu / ở đầu vì trước dùng slug của getServerSideProps không có
        content: data.content,
        title: data.title,
        gameType,
        bucket: appInfo.bucket,
        topics,
        tests,
    };
    useEffect(() => {
        if (window) {
            ga.event({
                action: "users_exclude_blog",
                params: { from: window.location.href },
            });
        }
    }, []);
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
};

export const getServerSideProps = async (context) => {
    // file này không dùng đến nữa
    try {
        let slug = context.params.study;
        let appInfo = getAppInfo();
        const contentSEO = await getHomeSeoContentStateApi(slug, "https://passemall.com");
        if (contentSEO) {
            contentSEO.content = replaceYear(contentSEO.content);
        }
        let titleSEO = contentSEO?.titleSeo?.length > 0 ? contentSEO.titleSeo[0] : appInfo.title;
        let descriptionSEO = contentSEO?.descSeo?.length > 0 ? contentSEO.descSeo[0] : appInfo.descriptionSEO;
        if (appInfo) {
            let listTopics = [];
            let tests = [];
            let appData: any = await readFileAppFromGoogleStorage(appInfo);
            listTopics = appData?.topics ?? [];
            tests = appData?.fullTests ?? [];

            const topic = listTopics.find((t) => slug.includes(t.tag) && !slug.includes("full-length"));
            const test = tests.find((t) => slug.includes(t.tag) && slug.includes("full-length"));
            const _branchTests = appData.branchTests;
            let branchTest;
            for (let key in _branchTests) {
                if (key.includes(slug)) branchTest = _branchTests[key];
            }
            let gameType = Config.TEST_GAME;
            let title = getTitle(appInfo);
            if (!!topic) {
                gameType = Config.TOPIC_GAME;
                title = topic.name;
            } else if (!!branchTest) {
                gameType = Config.BRANCH_TEST_GAME;
                title = branchTest.title;
            } else if (!!test) {
                title = test.title;
            }
            return convertToJSONObject({
                props: {
                    appInfo,
                    titleSEO,
                    descriptionSEO,
                    keywordSEO: appInfo.keywordSEO,
                    data: {
                        content: contentSEO?.content ?? "",
                        title,
                    },
                    topics: listTopics,
                    tests,
                    gameType,
                },
            });
        } else throw {};
    } catch (error) {
        context.res.writeHead(302, { Location: "/" }).end();
        return { props: {} };
    }
};

export default StudyPage;
