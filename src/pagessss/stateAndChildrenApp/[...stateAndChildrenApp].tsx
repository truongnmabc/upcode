import Layout2 from "@/components/layout/layout-2/Layout2";
import { stateName } from "@/components/state-app/HomeSingleApp";
import NewHome from "@/components/state-app/newHome";
import { IItemBlock } from "@/models/state/stateChildrenApp";
import { ITestInfo } from "@/models/TestInfo";
import StoreProvider from "@/redux/StoreProvider";
import {
    getHomeSeoContentStateApi,
    getSEOAndHeaderContentApi,
    requestGetListBlock,
} from "@/services/home.service";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { getLink } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import replaceYear from "@/utils/replaceYear";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { isParentApp } from "../../config/config_web";
import states from "../../data/statesName.json";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { getAppInfo, readAllAppInfos } from "../../utils/getAppInfo";
const ScrollToTopArrow = dynamic(
    () => import("../../components/container/ScrollToTopArrow"),
    {
        ssr: false,
    }
);
const SeoHeader = dynamic(() => import("@/components/seo/SeoHeader"));
const HomeSingleApp = dynamic(
    () => import("@/components/state-app/HomeSingleApp")
);

const ChildrenApp = ({
    listTopics,
    tests,
    keywordSEO,
    descriptionSEO,
    childAppInfo,
    homeSeoContent,
    titleSEO,
    _state,
    listBlock,
}: {
    listTopics?: ITopic[];
    tests?: ITestInfo[];
    keywordSEO: string;
    descriptionSEO: string;
    childAppInfo: IAppInfo;
    homeSeoContent: string;
    titleSEO?: string;
    _state: string; // '_state' là dang slug, 'state' là dạng tên riêng
    listBlock: IItemBlock[];
}) => {
    // appInfo ở đây là của app con nha
    return (
        <>
            <SeoHeader
                title={titleSEO}
                description={descriptionSEO}
                keyword={keywordSEO}
                ads
            />
            <StoreProvider
                appInfo={childAppInfo}
                webData={{ tests: tests, topics: listTopics }}
            />
            <Layout2
                appInfo={childAppInfo}
                listTopics={listTopics}
                tests={tests}
            >
                <NewHome
                    listTopics={listTopics}
                    tests={tests}
                    _state={stateName(_state)}
                    appInfo={childAppInfo}
                    // homeSeoContent={homeSeoContent}
                    listBlock={listBlock}
                />
            </Layout2>
            <ScrollToTopArrow />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    // trang giao diện các chứng chỉ con, được định tuyến trong exportPathMap tại next.config.js
    let stateAndChildrenApp = context.params.stateAndChildrenApp;
    let [slug, _state] = stateAndChildrenApp;
    let isParent = isParentApp();
    if (!isParent) {
        // chỗ này chưa bổ sung, sau làm riêng app con thì bổ sung vào
        const appInfo = getAppInfo();
        let listTopics = []; // topics
        let tests = []; // tests

        if (stateAndChildrenApp.length == 1) {
            if (states["cdl"].find((state) => state.tag === slug)) {
                // ** dùng luôn ds của cdl vì của dmv cũng tương tự, ở đây chỉ dùng trường tag thôi
                // trường hợp web được build ra là một web con có state thì đang config để trỏ url trang state về route này
                _state = slug;
                slug = "";
            } else if (states["dmv"].find((state) => state.tag === slug)) {
                // ** dùng luôn ds của cdl vì của dmv cũng tương tự, ở đây chỉ dùng trường tag thôi
                // trường hợp web được build ra là một web con có state thì đang config để trỏ url trang state về route này
                _state = slug;
                slug = "";
            }
        }

        let appData: any = await readFileAppFromGoogleStorage(
            appInfo,
            _state ?? ""
        );
        listTopics = appData?.topics ?? [];
        tests = appData?.fullTests ?? [];

        let titleAndDescSeo = await getSEOAndHeaderContentApi(
            false,
            _state,
            true
        );

        let listBlock;
        if (_state) {
            listBlock = await requestGetListBlock({
                // state: _state,
                // *NOTE: để tạm do các bang khác chưa có data
                state: "TX",
            });
        }

        let t = titleAndDescSeo.titleSEO;
        let d = titleAndDescSeo.descriptionSEO;

        if (!t) t = appInfo.title;
        if (!d) d = appInfo.descriptionSEO;

        let titleSEO = replaceYear(t ?? "");
        let descriptionSEO = replaceYear(d ?? "");

        return convertToJSONObject({
            props: {
                childAppInfo: appInfo,
                _state,
                listTopics,
                tests,
                titleSEO,
                descriptionSEO,
                keywordSEO: appInfo?.keywordSEO,
                homeSeoContent: { content: titleAndDescSeo.description },
                listBlock,
            },
        });
    } else {
        // vao app con, làm tương tự như ở /pages/index.tsx
        let listTopics = []; // topics
        let tests = []; // tests
        let listAppInfos = readAllAppInfos();
        let childAppInfo = listAppInfos.find((a) => {
            return slug === getLink(a).replaceAll("/", "");
        });
        if (childAppInfo) {
            if (!childAppInfo.hasState || (childAppInfo.hasState && _state)) {
                // nếu là trang app con không có state hoặc trang state của app con thì mới lấy dữ liệu test/topic về
                let appData: any = await readFileAppFromGoogleStorage(
                    childAppInfo,
                    _state ?? ""
                );
                listTopics = appData?.topics ?? [];
                tests = appData?.fullTests ?? [];
            }
        }
        // let homeSeoContent = await getHomeSeoContentApi(
        //     getLink(childAppInfo, _state)
        //         .split("/")
        //         .filter((_) => _)
        //         .join("-")
        //         .split("-") // xử lý trường hợp nhiều dấu -- cạnh nhau
        //         .filter((_) => _)
        //         .join("-")
        // );
        // if (homeSeoContent) {
        //     homeSeoContent.content = replaceYear(homeSeoContent.content);
        // }

        // await genstudyDataJSON(listAppInfos);

        // if (_state) {
        let seoSlug = [slug, _state].join("-");
        seoSlug = seoSlug
            .split("-")
            .filter((_) => _)
            .join("-");

        const contentSEO = await getHomeSeoContentStateApi(seoSlug);
        console.log("🚀 ~ contentSEO:", contentSEO);
        contentSEO.content = replaceYear(contentSEO?.content ?? "");
        let t = "";
        let d = "";
        try {
            t = contentSEO?.titleSeo[0];
            d = contentSEO?.descSeo[0];
        } catch (err) {}

        if (!t) t = childAppInfo.title;
        if (!d) d = childAppInfo.descriptionSEO;

        let titleSEO = replaceYear(t ?? "");
        let descriptionSEO = replaceYear(d ?? "");

        return convertToJSONObject({
            props: {
                titleSEO: titleSEO,
                descriptionSEO: descriptionSEO,
                listTopics,
                tests: tests,
                keywordSEO: childAppInfo?.keywordSEO,
                childAppInfo,
                _state: _state ?? "",
                homeSeoContent: contentSEO,
            },
            // revalidate: 1800, // sau 30p sẽ chạy lại hàm này 1 lần https://nextjs.org/docs/pages/api-reference/functions/get-static-props#revalidate
        });
    }
};

export default ChildrenApp;
