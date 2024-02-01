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
import { default as listAppTopics } from "../../data/studyData.json";
import { IAppInfo } from "../../models/AppInfo";
import { getAppInfo } from "../../utils/getAppInfo";
import { genStudyLink } from "@/utils/getStudyLink";
const ScrollToTopArrow = dynamic(() => import("../../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
const SEO = dynamic(() => import("@/components/seo/SEO"));
const StudyLayout = dynamic(() => import("../../container/study/StudyLayout"));

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
    let webData = {
        appId: appInfo.appId,
        type: SYNC_TYPE.TYPE_LEARN_TEST,
        fullSlug: router.asPath.slice(1, router.asPath.length), // mô tả tại IWebData, trong asPath có phần #level, slice để bỏ đi dấu / ở đầu vì trước dùng slug của getServerSideProps không có
        content: topic.content,
        title: topic.title,
        gameType,
        bucket: appInfo.bucket,
    }; // useEffect(() => {
    //     if (window) {
    //         ga.event({
    //             action: "users_exclude_blog",
    //             params: { from: window.location.href },
    //         });
    //     }
    // }, []);
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
    try {
        let slug = context.params.study;
        let appInfo = getAppInfo();
        let topics = listAppTopics.find((app) => app.appId === appInfo.appId).topics;
        const topic = topics.find((topic) => topic.url === slug);

        const contentSEO = await getHomeSeoContentStateApi(slug);
        if (contentSEO) {
            contentSEO.content = replaceYear(contentSEO.content);
        }
        let titleSEO = contentSEO?.titleSeo?.length > 0 ? contentSEO.titleSeo[0] : appInfo.title;
        let descriptionSEO = contentSEO?.descSeo?.length > 0 ? contentSEO.descSeo[0] : appInfo.descriptionSEO;
        if (topic || "/" + slug == genStudyLink(appInfo.appShortName)) {
            // đúng đường dẫn
            // quy định full-length-[APP_SHORT_NAME]-practice-test là vào phần test
            let gameType = Config.TEST_GAME;
            if (!!topic) {
                if (topic.isBranch) gameType = Config.BRANCH_TEST_GAME;
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
        } else throw {};
    } catch (error) {
        context.res.writeHead(302, { Location: "/" }).end();
        return { props: {} };
    }
};

export default StudyPage;
