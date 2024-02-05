import { IAppInfo } from "@/models/AppInfo";
import React from "react";
import Layout1 from "../../components/layout/layout-1/Layout1";
import MyContainer from "../../components/v4-material/MyContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./ParentAppLayout.scss";
import ListApp from "../../components/easy-prep/ListApp";
import AppAchievement from "../../components/easy-prep/AppAchievement";
import Testimonals from "../../components/easy-prep/Testimonals";
// import { callApi } from "@/services";

const ParentAppLayout = ({ appInfo, listAppInfos }: { appInfo: IAppInfo; listAppInfos: IAppInfo[] }) => {
    const isDesktop = useMediaQuery("(min-width: 769px)");
    const exportData = async () => {
        // for (let app of listAppInfos) {
        //     await callApi({
        //         url: `api/web?type=export-new-app&appId=${app.appId}&appName=${app.bucket}`,
        //         params: null,
        //         method: "get",
        //         baseURl: "https://test-dot-micro-enigma-235001.appspot.com/",
        //         headers: null,
        //     })
        //         .then(() => {
        //             console.log("ok", app.appId, app.bucket);
        //         })
        //         .catch((err) => {
        //             console.log("error", app.appId, app.bucket);
        //         });
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
