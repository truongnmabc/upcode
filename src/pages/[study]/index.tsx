// import dynamic from "next/dynamic";
import { useEffect } from "react";
import SEO from "../../components/seo/SEO";
import { SYNC_TYPE } from "../../config/config_sync";
import { isWebASVAB } from "../../config/config_web";
import StudyLayout from "../../container/study/StudyLayout";
import listAppTopics from "../../data/topic-landing-page.json";
// import * as ga from "../../lib/ga";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { getAppInfo } from "../../utils/getAppInfo";
import { useRouter } from "next/router";
import AppState from "@/redux/appState";
import { useAppSelector } from "@/redux/hooks";
import IWebData from "@/types/webData";
import replaceYear from "@/utils/replaceYear";
import convertToJSONObject from "@/utils/convertToJSONObject";
import StoreProvider from "@/redux/StoreProvider";
import { getHomeSeoContentStateApi } from "@/services/home.service";
import { getTitle } from "@/utils";
import dynamic from "next/dynamic";
const ScrollToTopArrow = dynamic(() => import("../../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
const StudyPage = ({
    appInfo,
    topic,
    titleSEO,
    descriptionSEO,
    keywordSEO,
}: {
    appInfo: IAppInfo;
    topic: IWebData;
    titleSEO: string;
    descriptionSEO: string;
    keywordSEO: string;
}) => {
    const _listTopics: ITopic[] = useAppSelector((state: AppState) => state.topicReducer.list);
    const listTopics = _listTopics.map((t) => t);
    const router = useRouter();
    useEffect(() => {
        // if (window) {
        //     ga.event({
        //         action: "users_exclude_blog",
        //         params: { from: window.location.href },
        //     });
        // }
    }, []);
    if (isWebASVAB()) {
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
                <StoreProvider appInfo={appInfo} webData={webData}>
                    <StudyLayout appInfo={appInfo} listTopics={listTopics} contentData={webData} />
                </StoreProvider>
                <ScrollToTopArrow />
            </>
        );
    }
    return <></>;
};

export const getServerSideProps = async (context) => {
    try {
        const isAsvab = isWebASVAB();
        let slug = context.params.study;
        let appInfo: IAppInfo | null = getAppInfo();
        const appName = appInfo.appShortName;
        let topics = listAppTopics.find((app) => app.appName === appName).topics;
        const topic = topics.find((topic) => topic.url === slug);

        const contentSEO = await getHomeSeoContentStateApi(slug, context.req.host);
        if (contentSEO) {
            contentSEO.content = replaceYear(contentSEO.content);
        }
        let titleSEO = contentSEO?.titleSeo?.length > 0 ? contentSEO.titleSeo[0] : appInfo.title;
        let descriptionSEO = contentSEO?.descSeo?.length > 0 ? contentSEO.descSeo[0] : appInfo.descriptionSEO;
        if (isAsvab) {
            if (topic || slug == "full-length-" + appInfo.appShortName + "-practice-test") {
                // đúng đường dẫn
                // quy định full-length-[APP_SHORT_NAME]-practice-test là vào phần test
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
                    },
                });
            } else throw {};
        }
        return { props: {} };
    } catch (error) {
        context.res.writeHead(302, { Location: "/" }).end();
        return { props: {} };
    }
};

export default StudyPage;
