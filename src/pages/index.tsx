import SeoHeader from "@/components/seo/SeoHeader";
import { isParentApp } from "@/config/config_web";
import { AppInfo, IAppInfo } from "@/models/AppInfo";
import { ITestInfo } from "@/models/TestInfo";
import { ITopic } from "@/models/Topic";
import StoreProvider from "@/redux/StoreProvider";
import { callApi } from "@/services";
import { getHomeSeoContentApi } from "@/services/home.service";
import { readFileAppFromGoogleStorage } from "@/services/importAppData";
import { setScrollDownAuto } from "@/utils";
import convertToJSONObject from "@/utils/convertToJSONObject";
import { getAppInfo, readAllAppInfos } from "@/utils/getAppInfo";
import replaceYear from "@/utils/replaceYear";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import stateData from "../data/statesName.json";
const HomeSingleApp = dynamic(() => import("@/container/single-app/HomeSingleApp"));
const ParentAppLayout = dynamic(() => import("@/container/parent-app/ParentAppLayout"));
const ScrollToTopArrow = dynamic(() => import("../components/v4-material/ScrollToTopArrow"), {
    ssr: false,
});
export default function Home({
    descriptionSEO,
    listTopics,
    tests,
    keywordSEO,
    appInfo,
    homeSeoContent,
    titleSEO = "",
    listAppInfo,
}: {
    listTopics?: ITopic[];
    tests?: ITestInfo[];
    keywordSEO: string;
    descriptionSEO: string;
    appInfo: IAppInfo;
    homeSeoContent: string;
    titleSEO?: string;
    listAppInfo: IAppInfo[];
}) {
    const _isParentApp = isParentApp();
    useEffect(() => {
        setScrollDownAuto("home");
    }, []);

    return (
        <>
            <SeoHeader title={titleSEO} description={descriptionSEO} keyword={keywordSEO} ads />
            <StoreProvider appInfo={appInfo} webData={_isParentApp ? {} : { tests: tests, topics: listTopics }} />
            {/* <div
                style={{ marginTop: "100px" }}
                onClick={() => {
                    genState();
                }}
            >
                kkkkkkkkkkk
            </div> */}
            {_isParentApp ? (
                <ParentAppLayout appInfo={appInfo} listAppInfos={listAppInfo} />
            ) : (
                <HomeSingleApp
                    appInfo={appInfo}
                    homeSeoContent={homeSeoContent}
                    listTopics={listTopics}
                    tests={tests}
                    _state=""
                />
            )}
            <ScrollToTopArrow />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    let listTopics = []; // topics
    let appInfo: IAppInfo | null = getAppInfo();
    let tests = []; // tests
    let homeSeoContent;
    let listAppInfo = [];
    let _isParentApp = isParentApp();
    if (_isParentApp) {
        listAppInfo = readAllAppInfos();
        listAppInfo = listAppInfo.filter((w: any) => w.appId).map((w: any) => new AppInfo(w));
    } else {
        // làm giao diện mới cho asvab nên check riêng asvab
        if (appInfo) {
            let appData: any = await readFileAppFromGoogleStorage(appInfo);
            listTopics = appData?.topics ?? [];
            tests = appData?.fullTests ?? [];
        }
        homeSeoContent = await getHomeSeoContentApi("home-seo-content");
    }

    if (homeSeoContent) {
        homeSeoContent.content = replaceYear(homeSeoContent.content);
    }
    // let rankMathTitle = appInfo?.rank_math_title;
    // if (appInfo && rankMathTitle) {
    //     rankMathTitle = rankMathTitle?.replace("%title%", appInfo.title).replace("%page%", "");
    //     rankMathTitle = replaceYear(rankMathTitle);
    // }
    // let titleSEO = !!rankMathTitle ? rankMathTitle : appInfo?.title;
    let titleSEO = appInfo.title;
    if (titleSEO) titleSEO = replaceYear(titleSEO);
    return convertToJSONObject({
        props: {
            titleSEO: titleSEO,
            descriptionSEO: appInfo?.descriptionSEO,
            listTopics,
            tests: tests,
            keywordSEO: appInfo?.keywordSEO,
            appInfo,
            homeSeoContent,
            listAppInfo,
        },
    });
};
const genState = async () => {
    // const states = stateData["real-estate"].slice(9, 10);
    // const appId = "6212062713741312";
    // const bucket = "realestate";
    // for (let s of states) {
    //     try {
    //         setTimeout(() => {}, 1000);
    //         let res = await callApi({
    //             url: `api/app/export-data-web?stateId=${s.id}&appId=${appId}&bucket=${bucket}&state=${s.tag}`,
    //             params: null,
    //             method: "get",
    //             baseURl: "http://localhost:3001/",
    //             headers: null,
    //             timeout: 90000,
    //         });
    //         console.log(s.name, res);
    //     } catch (e) {
    //         console.log("*****NOT*OK******", s.name);
    //     }
    // }
    // console.log("--------done-----------");

    let app = [
        // {
        //     bucket: "maf",
        //     appId: 6115280825614336,
        //     appName: "Microsoft Azure AZ-900",
        // },
        // {
        //     bucket: "cfa",
        //     appId: 6117350328762368,
        //     appName: "CFA Level 1",
        // },
        // {
        //     bucket: "comptiacysa",
        //     appId: 6326015811911680,
        //     appName: "CompTIA CySA+",
        // },
        // {
        //     bucket: "cen",
        //     appId: 4837345850294272,
        //     appName: "CEN",
        // },
        // {
        //     bucket: "journeymanelectrician",
        //     appId: 5316459300388864,
        //     appName: "Journeyman Electrician",
        // },
        // {
        //     bucket: "comptiaitf",
        //     appId: 6413438390632448,
        //     appName: "comptia itf+",
        // },
        // {
        //     bucket: "awscerifiedsysopsadministrator",
        //     appId: 5215607919214592,
        //     appName: "AWS Certified SysOps Administrator",
        // },
        // {
        //     bucket: "mcat",
        //     appId: 5685410002894848,
        //     appName: "MCAT",
        // },
        // {
        //     bucket: "pl300",
        //     appId: 6640384538050560,
        //     appName: "PL-300",
        // },
        // {
        //     bucket: "awscertifieddeveloper",
        //     appId: 5910018231631872,
        //     appName: "AWS Certified Developer",
        // },
        // {
        //     bucket: "australiancitizenship",
        //     appId: 6500317395943424,
        //     appName: "Australian Citizenship",
        // },
        // {
        //     bucket: "fsot",
        //     appId: 6634431222644736,
        //     appName: "FSOT",
        // },
        // {
        //     bucket: "paramedic",
        //     appId: 5643531427250176,
        //     appName: "Paramedic",
        // },
    ];

    for (let a of app) {
        let bucket = a.bucket;
        let appId = a.appId;
        try {
            setTimeout(() => {}, 1000);
            let res = await callApi({
                url: `api/app/export-data-web?appId=${appId}&bucket=${bucket}`,
                params: null,
                method: "get",
                baseURl: "http://localhost:3001/",
                headers: null,
                timeout: 90000,
            });
            console.log(a.appName, res);
        } catch (e) {
            console.log("*****NOT*OK******", a.appName);
        }
    }
};
