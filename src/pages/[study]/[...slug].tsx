import Config from "@/config";
import StoreProvider from "@/redux/StoreProvider";
import { getHomeSeoContentStateApi } from "@/services/home.service";
import IWebData from "@/types/webData";
import { getLink, getTitle } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { genStudyLink } from "@/utils/getStudyLink";
import replaceYear from "@/utils/replaceYear";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import SEO from "../../components/seo/SEO";
import { SYNC_TYPE } from "../../config/config_sync";
import { isParentApp } from "../../config/config_web";
import StudyLayout from "../../container/study/StudyLayout";
import { default as listAppTopics } from "../../data/studyData.json";
import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { readAllAppInfos } from "../../utils/getAppInfo";
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        let study = context.params.study as string;
        let slug = context.params.slug[0];
        // asvab-practice-test : asvab-arithmetic-reasoning-practice-test
        let _isParentApp = isParentApp();
        if (!_isParentApp) {
            throw { p: 1 };
        }
        let listAppInfo: any[] = readAllAppInfos();
        listAppInfo = listAppInfo.map((app) => new AppInfo(app));
        let appInfo = listAppInfo.find((app) => getLink(app) === "/" + study);

        if (!!appInfo) {
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
            } else throw { p: 2 };
        } else throw { p: 3 };
    } catch (error) {
        console.log(error);

        context.res.writeHead(302, { Location: "/" }).end();
        return { props: {} };
    }
};
export default StudyPage;
