import Config from "@/config";
import StoreProvider from "@/redux/StoreProvider";
import { getHomeSeoContentStateApi } from "@/services/home.service";
import IWebData from "@/types/webData";
import { getLink, getTitle } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import replaceYear from "@/utils/replaceYear";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import SEO from "../../components/seo/SEO";
import { SYNC_TYPE } from "../../config/config_sync";
import { isParentApp } from "../../config/config_web";
import StudyLayout from "../../container/study/StudyLayout";
import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { getAppInfo, readAllAppInfos } from "../../utils/getAppInfo";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { ITestInfo } from "@/models/TestInfo";
import { ITopic } from "@/models/Topic";
import states from "../../data/statesName.json";
import { useEffect } from "react";
const ScrollToTopArrow = dynamic(() => import("../../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
const StudyPage = ({
    appInfo,
    data,
    titleSEO,
    descriptionSEO,
    keywordSEO,
    gameType,
    topics,
    tests,
    _state,
}: {
    appInfo: IAppInfo;
    data: IWebData;
    titleSEO: string;
    descriptionSEO: string;
    keywordSEO: string;
    gameType: -1 | 0 | 1;
    topics: ITopic[];
    tests: ITestInfo[];
    _state: string;
}) => {
    const router = useRouter();
    let _slug = router.asPath.slice(1, router.asPath.length); // mô tả tại IWebData, trong asPath có phần #level, slice để bỏ đi dấu / ở đầu vì trước dùng slug của getServerSideProps không có
    let webData = {
        appId: appInfo.appId,
        type: SYNC_TYPE.TYPE_LEARN_TEST,
        fullSlug: _slug,
        content: data.content,
        title: data.title,
        gameType,
        bucket: appInfo.bucket,
        topics,
        tests,
        _state,
    };
    useEffect(() => {
        if (appInfo.hasState && !!_state) localStorage.setItem("select-state-" + appInfo.appNameId, _state);
    }, []);
    return (
        <>
            <SEO
                appInfo={appInfo}
                addMathJax={!!appInfo.usingMathJax}
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
        // các trang học đều được định tuyến về đây trong next.config.js (rewrites)
        let [appNameId, slug] = context.params.slug;
        let seoSlug = [appNameId, slug].join("-");
        if (!slug) {
            slug = appNameId; // trường hợp web được build là một single app thì trang học sẽ là /[study]
            seoSlug = slug;
        }
        seoSlug = seoSlug
            .split("-")
            .filter((_) => _)
            .join("-");
        console.log("xxxx", appNameId, slug, seoSlug);

        let _isParentApp = isParentApp();
        let listAppInfo: any[] = readAllAppInfos();
        listAppInfo = listAppInfo.map((app) => new AppInfo(app));

        let appInfo = getAppInfo();
        if (_isParentApp) appInfo = listAppInfo.find((app) => getLink(app) === "/" + appNameId);

        if (!!appInfo) {
            let listTopics = [];
            let tests = [];
            let _state = "";
            if (appInfo.hasState) {
                // nếu app có state (thì url dẫn đến trang học này có chứa state trong đó)
                let maxLengthMatching = 0;
                states[appInfo.appShortName].forEach((s) => {
                    // bug cho trường hợp verginia | west-verginia
                    if (slug.includes(s.tag)) {
                        if (s.tag.length > maxLengthMatching) {
                            maxLengthMatching = s.tag.length;
                            _state = s.tag;
                        }
                    }
                });
                // _state = states[appInfo.appShortName].find((s) => slug.includes(s.tag)).tag; // WARNING!
            }
            let appData: any = await readFileAppFromGoogleStorage(appInfo, _state);
            listTopics = appData?.topics ?? [];
            tests = appData?.fullTests ?? [];

            let titleSEO = "";
            let descriptionSEO = "";
            let contentSeo = "";
            try {
                const contentSEO = await getHomeSeoContentStateApi(seoSlug);

                if (contentSEO) {
                    contentSEO.content = replaceYear(contentSEO.content);
                }
                contentSeo = contentSEO.content;
                titleSEO = contentSEO?.titleSeo[0] ?? appInfo.title;
                descriptionSEO = contentSEO?.descSeo[0] ?? appInfo.descriptionSEO;
            } catch (err) {
                titleSEO = appInfo.title;
                descriptionSEO = appInfo.descriptionSEO;
            }

            // console.log(contentSeo, titleSEO, descriptionSEO);

            const topic = listTopics.find((t) => t.slug.includes(slug) && !slug.includes("full-length")); // WARNING!
            const test = tests.find((t) => t.slug.includes(slug) && slug.includes("full-length")); // WARNING!
            const _branchTests = appData.branchTests;
            let branchTest;
            for (let key in _branchTests) {
                // asvab
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
            console.log(gameType);

            return convertToJSONObject({
                props: {
                    appInfo,
                    titleSEO,
                    descriptionSEO,
                    keywordSEO: appInfo.keywordSEO,
                    data: {
                        content: contentSeo,
                        title: title,
                    },
                    gameType,
                    topics: listTopics,
                    tests,
                    _state,
                },
            });
        } else throw { p: 3 };
    } catch (error) {
        console.log(error);
        context.res.writeHead(302, { Location: "/" }).end();
        return { props: {} };
    }
};
export default StudyPage;
