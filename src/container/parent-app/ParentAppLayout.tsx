import { IAppInfo } from "@/models/AppInfo";
import React from "react";
import Layout1 from "../../components/layout/layout-1/Layout1";
import MyContainer from "../../components/v4-material/MyContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./ParentAppLayout.scss";
import ListApp from "../../components/easy-prep/ListApp";
import AppAchievement from "../../components/easy-prep/AppAchievement";
import Testimonals from "../../components/easy-prep/Testimonals";
import { callApi } from "@/services";

const ParentAppLayout = ({ appInfo, listAppInfos }: { appInfo: IAppInfo; listAppInfos: IAppInfo[] }) => {
    const isDesktop = useMediaQuery("(min-width: 769px)");
    const exportData = async () => {
        // console.log(exportApp.length);
        // for (let app of exportApp) {
        //     // if (notExport.find((a) => a.appId !== app.appId) && app.appId !== -1) {
        //     await callApi({
        //         url: `api/web?type=export-new-app&appId=${app.appId}&appName=${app.bucket}`,
        //         params: null,
        //         method: "get",
        //         baseURl: "https://test-dot-micro-enigma-235001.appspot.com/",
        //         headers: null,
        //         timeout: 90000,
        //     })
        //         .then(() => {
        //             console.log("ok", app.appId, app.bucket);
        //         })
        //         .catch((err) => {
        //             console.log("error", app.appId, app.bucket);
        //         });
        //     // }
        // }
    };
    return (
        <Layout1 listAppInfos={listAppInfos}>
            <MyContainer className="take-learning-to-the-next-level ">
                <div className="align-center -container">
                    <div className="landing-title" onClick={() => exportData()}>
                        <h1 style={{ display: "none" }}>
                            {isDesktop ? "Easy Prep: take learning to the next level" : "Easy Solution For Teaching & Learning"}
                        </h1>
                        <div className="landing-title-text">
                            <img src="/info/images/logo60.png" alt="logo compact" />
                            <span className="-for-desktop">
                                <span className="part-color-1">{`asy Prep`}</span>
                                {": Take Learning To The Next Level"}
                            </span>
                            <span className="-for-mobile">
                                <span className="part-color-1">{`asy `}</span>
                                {" Solution For Teaching & Learning"}
                            </span>
                        </div>

                        <p>Our mission is to bring you the best online test prep that you can learn anytime, anywhere.</p>
                    </div>
                    <img className="img-landing" src="/images/easyprep/landing-img.png" alt="Take learning" />
                </div>
            </MyContainer>
            <ListApp listAppInfos={listAppInfos} />
            <AppAchievement />
            <Testimonals />
            {/* Blog */}
        </Layout1>
    );
};

export default ParentAppLayout;

let exportApp = [
    // {
    //     appId: 4561360798089216,
    //     bucket: "apsychology",
    // }, //
    // {
    //     appId: 6660380035121152,
    //     bucket: "comptiacysa",
    // }, //
    // {
    //     appId: 4856116048560128,
    //     bucket: "apush",
    // }, //
    // {
    //     appId: 5001009542725632,
    //     bucket: "comptiasecurity",
    // }, //
    // {
    //     appId: 6513146321698816,
    //     bucket: "naplex",
    // }, //
    // {
    //     appId: 4745883528724480,
    //     bucket: "parapro",
    // }, //
    // {
    //     appId: 5443462460604416,
    //     bucket: "wonderlic",
    // }, //
    // {
    //     appId: 6391284127236096,
    //     bucket: "cfalevel2",
    // }, //
    // {
    //     appId: 5708468430307328,
    //     bucket: "theory2",
    // }, //
    // {
    //     appId: 6036400967254016,
    //     bucket: "part107",
    // }, //
    // {
    //     appId: 6552799815925760,
    //     bucket: "ceh",
    // }, //
    // {
    //     appId: 6030675607027712,
    //     bucket: "maf",
    // }, //
    // {
    //     appId: 5985539595436032,
    //     bucket: "pert",
    // }, //
    // {
    //     appId: 6341062520995840,
    //     bucket: "g1_v2",
    // }, //
    // {
    //     appId: 5717345143095296,
    //     bucket: "phr",
    // }, //
    // {
    //     appId: 6482106442055680,
    //     bucket: "sie",
    // }, //
    // {
    //     appId: 6504182246801408,
    //     bucket: "hiset",
    // }, //
    // {
    //     appId: 6119576033034240,
    //     bucket: "accuplacer",
    // }, //
    // {
    //     appId: 6564860188950528,
    //     bucket: "chspe",
    // }, //
    // {
    //     appId: 5719960095555584,
    //     bucket: "mblex",
    // }, //
    // {
    //     appId: 4574196346650624,
    //     bucket: "cissp",
    // }, //
    // {
    //     appId: 6536271351513088,
    //     bucket: "ccsp",
    // }, //
    // {
    //     appId: 4821614053031936,
    //     bucket: "vtne",
    // }, //
    // {
    //     appId: 5657969412800512,
    //     bucket: "hesia2",
    // }, //
    // {
    //     appId: 5473188218667008,
    //     bucket: "comptianetwork",
    // }, //
    // {
    //     appId: 5794588703850496,
    //     bucket: "nasmcpt",
    // }, //
    // {
    //     appId: 4878338973761536,
    //     bucket: "asvab",
    // }, //
    // {
    //     appId: 5421595969454080,
    //     bucket: "pccn",
    // }, //
    // {
    //     appId: 6098076194308096,
    //     bucket: "gre",
    // }, //
    // {
    //     appId: 5311366673989632,
    //     bucket: "ccat",
    // }, //
    // {
    //     appId: 4896549496684544,
    //     bucket: "cbest",
    // }, //
    // {
    //     appId: 5296397775536128,
    //     bucket: "ged",
    // }, //
    // {
    //     appId: 6219842827845632,
    //     bucket: "awscp_new",
    // }, //
    // {
    //     appId: 5462477120733184,
    //     bucket: "tasc",
    // }, //
    // {
    //     appId: 6174673429594112,
    //     bucket: "hspt",
    // }, //
    // {
    //     appId: 6465005999357952,
    //     bucket: "nmls",
    // }, //
    // {
    //     appId: 5243570678136832,
    //     bucket: "emtb",
    // }, //
    // {
    //     appId: 4739223829610496,
    //     bucket: "capm",
    // }, //
    // {
    //     appId: 5615326898159616,
    //     bucket: "cfa",
    // }, //
    // {
    //     appId: 5391119996157952,
    //     bucket: "ccna",
    // }, //
    // {
    //     appId: 5601951678988288,
    //     bucket: "series7",
    // }, //
    // {
    //     appId: 6328870527565824,
    //     bucket: "phlebotomy",
    // }, //
    // {
    //     appId: 5186025303310336,
    //     bucket: "teas",
    // }, //
    // {
    //     appId: 4540394026041344,
    //     bucket: "cpce",
    // }, //
    // {
    //     appId: 5962925959282688,
    //     bucket: "awscertifiedsolutionsarchitect",
    // }, //
    // {
    //     appId: 5881924151148544,
    //     bucket: "ase",
    // }, //
    // {
    //     appId: 6711507096174592,
    //     bucket: "pmp",
    // }, //
    // {
    //     appId: 5569772466995200,
    //     bucket: "nce",
    // }, //
    // {
    //     appId: 5753091221618688,
    //     bucket: "ptce",
    // }, //
    // {
    //     appId: 4691917260455936,
    //     bucket: "nclexpn",
    // }, //
    // {
    //     appId: 5017963709071360,
    //     bucket: "nclexrn",
    // }, //
    // {
    //     appId: 5397248982646784,
    //     bucket: "fsc",
    // }, //
    [
        {
            appName: "HVAC",
            appId: 4811628111462400,
            bucket: "hvac",
        },
        {
            appName: "CPA",
            appId: 6221301783986176,
            bucket: "cpa",
        },
        {
            appName: "NATE",
            appId: 5198848772276224,
            bucket: "nate",
        },
        {
            appName: "CNA",
            appId: 5007397443600384,
            bucket: "cna",
        },
        {
            appName: "TABE",
            appId: 5258846803066880,
            bucket: "tabe",
        },
        {
            appName: "MBE",
            appId: 4791736938266624,
            bucket: "mbe",
        },
        {
            appName: "Servsafe",
            appId: 5746867797229568,
            bucket: "servsafe",
        },
        {
            appName: "TSI",
            appId: 5278385414602752,
            bucket: "tsi",
        },
        {
            appName: "DKT",
            appId: 5252858371899392,
            bucket: "dkt",
        },
        {
            appName: "EPA 608",
            appId: 6074233270566912,
            bucket: "epa608",
        },
        {
            appName: "DAT",
            appId: 5276218037370880,
            bucket: "dat",
        },
        {
            appName: "CAST",
            appId: 6449536089194496,
            bucket: "cast",
        },
        {
            appName: "CompTIA A+",
            appId: 5551925043920896,
            bucket: "comptiaa",
        },
    ],
];
