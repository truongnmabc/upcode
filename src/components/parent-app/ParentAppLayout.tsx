import { IAppInfo } from "@/models/AppInfo";
import React from "react";
import Layout1 from "../layout/layout-1/Layout1";
import MyContainer from "../v4-material/MyContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./ParentAppLayout.scss";

const ParentAppLayout = ({ appInfo, listAppInfos }: { appInfo: IAppInfo; listAppInfos: IAppInfo[] }) => {
    const isDesktop = useMediaQuery("(min-width: 769px)");
    return (
        <>
            <Layout1 listAppInfos={listAppInfos}>
                <MyContainer className="take-learning-to-the-next-level ">
                    <div className="align-center -container">
                        <div className="landing-title">
                            <img src="/images/easy-prep/logo-word.png" />
                            <h1 className="landing-title-h1">
                                <span className="invisible-text">E</span>
                                <span className="part-color-1">{`asy ${isDesktop ? "Prep" : ""}`}</span>
                                {isDesktop ? (
                                    <>
                                        <span>{": take learning"}</span>
                                        <br />
                                        <span>{"to the next level"}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{"Solution For"}</span>
                                        <br />
                                        <span>{"Teaching & Learning"}</span>
                                    </>
                                )}
                            </h1>
                            <p>Our mission is to bring you the best online test prep that you can learn anytime, anywhere.</p>
                        </div>
                        <img className="img-landing" src="/images/easy-prep/landing-img.png" alt="Take learning" />
                    </div>
                </MyContainer>
            </Layout1>
        </>
    );
};

export default ParentAppLayout;
