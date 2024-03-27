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
        //         url: `api/app/export-data-web?appId=${app.appId}&bucket=${app.bucket}`, //`api/web?type=export-new-app&appId=${app.appId}&appName=${app.bucket}`,
        //         params: null,
        //         method: "get",
        //         baseURl: "http://localhost:3001/", //"https://test-dot-micro-enigma-235001.appspot.com/",
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
    //     appName: "CompTIA Sec+",
    //     appId: 5001009542725632,
    //     bucket: "comptiasecurity",
    // },
    // {
    //     appName: "NAPLEX",
    //     appId: 6513146321698816,
    //     bucket: "naplex",
    // },
    // {
    //     appName: "HVAC",
    //     appId: 4811628111462400,
    //     bucket: "hvac",
    // },
    // {
    //     appName: "Parapro",
    //     appId: 4745883528724480,
    //     bucket: "parapro",
    // },
    // {
    //     appName: "Wonderlic",
    //     appId: 5443462460604416,
    //     bucket: "wonderlic",
    // },
    // {
    //     appName: "CPA",
    //     appId: 6221301783986176,
    //     bucket: "cpa",
    // },
    // {
    //     appName: "NATE",
    //     appId: 5198848772276224,
    //     bucket: "nate",
    // },
    // {
    //     appName: "CNA",
    //     appId: 5007397443600384,
    //     bucket: "cna",
    // },
    // {
    //     appName: "CFA Level 2",
    //     appId: 6391284127236096,
    //     bucket: "cfalevel2",
    // },
    // {
    //     appName: "DRIVING THEORY UK",
    //     appId: 5708468430307328,
    //     bucket: "theory2",
    // },
    // {
    //     appName: "FAA Part 107",
    //     appId: 6036400967254016,
    //     bucket: "part107",
    // },
    // {
    //     appName: "CEH",
    //     appId: 6552799815925760,
    //     bucket: "ceh",
    // },
    // {
    //     appName: "Microsoft Azure AZ-900",
    //     appId: 6030675607027712,
    //     bucket: "maf",
    // },
    // {
    //     appName: "TABE",
    //     appId: 5258846803066880,
    //     bucket: "tabe",
    // },
    // {
    //     appName: "AP Psychology",
    //     appId: 4561360798089216,
    //     bucket: "apsychology",
    // },
    // {
    //     appName: "PERT",
    //     appId: 5985539595436032,
    //     bucket: "pert",
    // },
    // {
    //     appName: "Ontario G1",
    //     appId: 6341062520995840,
    //     bucket: "g1_v2",
    // },
    // {
    //     appName: "MBE",
    //     appId: 4791736938266624,
    //     bucket: "mbe",
    // },
    // {
    //     appName: "Servsafe",
    //     appId: 5746867797229568,
    //     bucket: "servsafe",
    // },
    // {
    //     appName: "FSC",
    //     appId: 5397248982646784,
    //     bucket: "fsc",
    // },
    // {
    //     appName: "PHR",
    //     appId: 5717345143095296,
    //     bucket: "phr",
    // },
    // // {
    // //     appName: "CDL",
    // //     appId: 6540077669810176,
    // //     bucket: "cdl_v2",
    // // },
    // {
    //     appName: "SIE",
    //     appId: 6482106442055680,
    //     bucket: "sie",
    // },
    // {
    //     appName: "NCLEX RN",
    //     appId: 5017963709071360,
    //     bucket: "nclexrn",
    // },
    // {
    //     appName: "HISET",
    //     appId: 6504182246801408,
    //     bucket: "hiset",
    // },
    // {
    //     appName: "Accuplacer",
    //     appId: 6119576033034240,
    //     bucket: "accuplacer",
    // },
    // {
    //     appName: "CHSPE",
    //     appId: 6564860188950528,
    //     bucket: "chspe",
    // },
    // {
    //     appName: "MBLEx",
    //     appId: 5719960095555584,
    //     bucket: "mblex",
    // },
    // {
    //     appName: "CISSP",
    //     appId: 4574196346650624,
    //     bucket: "cissp",
    // },
    // {
    //     appName: "TSI",
    //     appId: 5278385414602752,
    //     bucket: "tsi",
    // },
    // {
    //     appName: "CCSP",
    //     appId: 6536271351513088,
    //     bucket: "ccsp",
    // },
    // {
    //     appName: "VTNE",
    //     appId: 4821614053031936,
    //     bucket: "vtne",
    // },
    // {
    //     appName: "HESI A2",
    //     appId: 5657969412800512,
    //     bucket: "hesia2",
    // },
    // {
    //     appName: "CompTIA Net+",
    //     appId: 5473188218667008,
    //     bucket: "comptianetwork",
    // },
    // {
    //     appName: "NASM",
    //     appId: 5794588703850496,
    //     bucket: "nasmcpt",
    // },
    // {
    //     appName: "DKT",
    //     appId: 5252858371899392,
    //     bucket: "dkt",
    // },
    // // {
    // //     appName: "ASVAB",
    // //     appId: 4878338973761536,
    // //     bucket: "asvab",
    // // },
    // {
    //     appName: "PCCN",
    //     appId: 5421595969454080,
    //     bucket: "pccn",
    // },
    // {
    //     appName: "GRE",
    //     appId: 6098076194308096,
    //     bucket: "gre",
    // },
    // {
    //     appName: "CCAT",
    //     appId: 5311366673989632,
    //     bucket: "ccat",
    // },
    // {
    //     appName: "CBEST",
    //     appId: 4896549496684544,
    //     bucket: "cbest",
    // },
    // {
    //     appName: "GED",
    //     appId: 5296397775536128,
    //     bucket: "ged",
    // },
    // {
    //     appName: "CompTIA CySA+",
    //     appId: 6660380035121152,
    //     bucket: "comptiacysa",
    // },
    // {
    //     appName: "AWS Cloud Practitioner",
    //     appId: 6219842827845632,
    //     bucket: "awscp_new",
    // },
    // {
    //     appName: "EPA 608",
    //     appId: 6074233270566912,
    //     bucket: "epa608",
    // },
    // {
    //     appName: "TASC",
    //     appId: 5462477120733184,
    //     bucket: "tasc",
    // },
    // {
    //     appName: "APUSH",
    //     appId: 4856116048560128,
    //     bucket: "apush",
    // },
    // {
    //     appName: "HSPT",
    //     appId: 6174673429594112,
    //     bucket: "hspt",
    // },
    // // {
    // //     appName: "DMV",
    // //     appId: 6309732366155776,
    // //     bucket: "dmv",
    // // },
    // {
    //     appName: "NMLS",
    //     appId: 6465005999357952,
    //     bucket: "nmls",
    // },
    // {
    //     appName: "EMT",
    //     appId: 5243570678136832,
    //     bucket: "emtb",
    // },
    // {
    //     appName: "CAPM",
    //     appId: 4739223829610496,
    //     bucket: "capm",
    // },
    // {
    //     appName: "CFA Level 1",
    //     appId: 5615326898159616,
    //     bucket: "cfa",
    // },
    // {
    //     appName: "CCNA",
    //     appId: 5391119996157952,
    //     bucket: "ccna",
    // },
    // {
    //     appName: "Series 7",
    //     appId: 5601951678988288,
    //     bucket: "series7",
    // },
    // {
    //     appName: "NCLEX PN",
    //     appId: 4691917260455936,
    //     bucket: "nclexpn",
    // },
    // {
    //     appName: "DAT",
    //     appId: 5276218037370880,
    //     bucket: "dat",
    // },
    // {
    //     appName: "Phlebotomy",
    //     appId: 6328870527565824,
    //     bucket: "phlebotomy",
    // },
    // {
    //     appName: "TEAS",
    //     appId: 5186025303310336,
    //     bucket: "teas",
    // },
    // {
    //     appName: "CPCE",
    //     appId: 4540394026041344,
    //     bucket: "cpce",
    // },
    // {
    //     appName: "AWS Solutions Architect Associate",
    //     appId: 5962925959282688,
    //     bucket: "awscertifiedsolutionsarchitect",
    // },
    // {
    //     appName: "ASE Series A",
    //     appId: 5881924151148544,
    //     bucket: "ase",
    // },
    // {
    //     appName: "PTCE",
    //     appId: 5753091221618688,
    //     bucket: "ptce",
    // },
    // {
    //     appName: "PMP",
    //     appId: 6711507096174592,
    //     bucket: "pmp",
    // },
    // {
    //     appName: "CAST",
    //     appId: 6449536089194496,
    //     bucket: "cast",
    // },
    // {
    //     appName: "NCE",
    //     appId: 5569772466995200,
    //     bucket: "nce",
    // },
    // {
    //     appName: "CompTIA A+",
    //     appId: 5551925043920896,
    //     bucket: "comptiaa",
    // },
];
