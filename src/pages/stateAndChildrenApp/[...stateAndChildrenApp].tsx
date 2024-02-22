import { ITestInfo } from "@/models/TestInfo";
import StoreProvider from "@/redux/StoreProvider";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { getLink } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { isParentApp } from "../../config/config_web";
import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import { getAppInfo, readAllAppInfos } from "../../utils/getAppInfo";
import replaceYear from "@/utils/replaceYear";
import states from "../../data/statesName.json";
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
    state,
}: {
    listTopics?: ITopic[];
    tests?: ITestInfo[];
    keywordSEO: string;
    descriptionSEO: string;
    childAppInfo: IAppInfo;
    // homeSeoContent: string;
    titleSEO?: string;
    state: string;
}) => {
    // appInfo ở đây là của app con nha
    return (
        <>
            <SeoHeader title={titleSEO} description={descriptionSEO} keyword={keywordSEO} />
            <StoreProvider appInfo={childAppInfo} webData={{ tests: tests, topics: listTopics }} />
            <HomeSingleApp appInfo={childAppInfo} homeSeoContent={""} listTopics={listTopics} tests={tests} state={state} />
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
        listAppInfo.forEach((app) => {
            if (app.hasState) {
                states.forEach((state) => {
                    let url = getLink(app, state.toLowerCase().trim().replaceAll(" ", "-"));
                    if (!url.includes("https:")) paths.push(formatData(url));
                });
            }
        });
    }
    return {
        paths,
        fallback: false,
    };
};

const formatData = (url: string) => {
    return {
        params: {
            stateAndChildrenApp: url.replace("/", "").split("/"),
        },
    };
};
export const getStaticProps: GetStaticProps = async (context) => {
    // trang giao diện các chứng chỉ con, được định tuyến trong exportPathMap tại next.config.js
    let stateAndChildrenApp = context.params.stateAndChildrenApp;
    let [slug, state] = stateAndChildrenApp;
    let isParent = isParentApp();
    if (!isParent) {
        // chỗ này chưa bổ sung, sau làm riêng app con thì bổ sung vào
        if (stateAndChildrenApp.length == 1) {
            if (states.find((state) => state.toLowerCase().trim().replace(" ", "-") === slug)) {
                // trường hợp web được build ra là một web con có state thì đang config để trỏ url trang state về route này
                state = slug;
                slug = "";
            }
        }
        return convertToJSONObject({
            props: {},
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
            if (!childAppInfo.hasState || (childAppInfo.hasState && state)) {
                // nếu là trang app con không có state hoặc trang state của app con thì mới lấy dữ liệu test/topic về
                let appData: any = await readFileAppFromGoogleStorage(childAppInfo);
                listTopics = appData?.topics ?? [];
                tests = appData?.fullTests ?? [];
            }
        }
        // let homeSeoContent = await getHomeSeoContentApi("home-seo-content");
        // if (homeSeoContent) {
        //     homeSeoContent.content = replaceYear(homeSeoContent.content);
        // }

        let titleSEO = replaceYear(childAppInfo.title);
        let descriptionSEO = replaceYear(childAppInfo.descriptionSEO);

        return convertToJSONObject({
            props: {
                titleSEO: titleSEO,
                descriptionSEO: descriptionSEO,
                listTopics,
                tests: tests,
                keywordSEO: childAppInfo?.keywordSEO,
                childAppInfo,
                state: state ?? "",
                // homeSeoContent,
            },
        });
    }
};

export default ChildrenApp;

// let genstudyDataJSON = async (listAppInfos) => {
//     let r = "[";
//     let branchs = [
//         {
//             title: "Marine ASVAB Practice Test",
//             url: "marine-asvab-practice-test",
//             tag: "arithmetic-reasoning",
//             isBranch: true,
//         },
//         {
//             title: "Navy ASVAB Practice Test",
//             url: "navy-asvab-practice-test",
//             tag: "arithmetic-reasoning",
//             isBranch: true,
//         },
//         {
//             title: "Army ASVAB Practice Test",
//             url: "army-asvab-practice-test",
//             tag: "arithmetic-reasoning",
//             isBranch: true,
//         },
//         {
//             title: "Coast Guard ASVAB Practice Test",
//             url: "asvab-coast-guard-practice-test",
//             tag: "arithmetic-reasoning",
//             isBranch: true,
//         },
//         {
//             title: "Air Force ASVAB Practice Test",
//             url: "air-force-asvab-practice-test",
//             tag: "arithmetic-reasoning",
//             isBranch: true,
//         },
//         {
//             title: "National Guard ASVAB Practice Test",
//             url: "national-guard-asvab-practice-test",
//             tag: "arithmetic-reasoning",
//             isBranch: true,
//         },
//     ];
//     for (let app of listAppInfos) {
//         if (app.appId !== -1)
//             try {
//                 let appData: any = await readFileAppFromGoogleStorage(app);
//                 let _listTopics = appData?.topics ?? [];
//                 let _tests = appData?.fullTests ?? [];
//                 r +=
//                     JSON.stringify({
//                         appId: app.appId,
//                         topics: _listTopics
//                             .map((t) => ({
//                                 title: t.name,
//                                 url: genStudyLink(app.appShortName, t.tag, false),
//                                 tag: t.tag,
//                             }))
//                             .push(...(app.appShortName === "asvab" ? branchs : [])),
//                         fullTests: _tests.map((t) => genStudyLink(app.appShortName, t?.tag, true)), //[genStudyLink(bucket, "")],
//                     }).replaceAll("/", "") + ",";
//             } catch (e) {
//                 console.log("error", app.bucket);
//             }
//     }
//     r += "]";
//     console.log(r);
// };
