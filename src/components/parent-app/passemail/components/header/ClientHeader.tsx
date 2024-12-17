import "./ClientHeader.scss";
import React, { useState } from "react";
import MyContainer from "@/components/v4-material/MyContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@/components/icon/MenuIcon";
import dynamic from "next/dynamic";
import CloseIcon from "@/components/icon/CloseIcon";
import { APP_SHORT_NAME } from "@/config_app";
import { IAppInfo } from "@/models/AppInfo";
import Link from "next/link";
import { genLinkPro } from "@/config/routes";
import UserAvatar from "./UserAvatar";
import { useSelector } from "react-redux";
import AppState from "@/redux/appState";
import SwitchTheme from "../SwitchTheme";
import useThemeCustom from "@/components/v4-material/useThemeCustom";
import Config from "@/config";
import getRoutesFromStep from "@/utils/getRoutesFromStep";
const SwipeableDrawer = dynamic(() => import("@mui/material/SwipeableDrawer"), { ssr: false });
const DownloadAppV0 = dynamic(() => import("./DownloadAppV0"), { ssr: false });

// header này về build client-side để check hiện Get pro
const ClientHeader = ({ appInfo, isReview }: { appInfo: IAppInfo; isReview?: boolean }) => {
    const isDesktop = useMediaQuery("(min-width: 769px)");
    const isPro = useSelector((state: AppState) => state.userReducer.isPro);
    const currentStep = useSelector((state: AppState) => state.studyReducer.currentStep);
    const isLearning = !!currentStep && currentStep !== Config.STEP_HOME;
    const haveGetProBtn = !isPro && appInfo.usingFeaturePro;
    const havePro = isPro && appInfo.usingFeaturePro;
    const [openMenu, setOpenMenu] = useState(false);
    const { theme } = useThemeCustom();
    let srcLogo = `/logo-${theme == "dark" ? "dark" : "light"}.png`;
    let routesLearning = getRoutesFromStep(Config.STEP_LEARNING, appInfo);
    return (
        <header className="v0-app-header">
            <MyContainer className="v0-app-header-container">
                {isDesktop ? (
                    <>
                        <div className="v0-app-header-option-left">
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </div>
                        <div className="v0-app-header-option-right">
                            {/* <a href={"/study-plan?appNameId=" + appInfo.appNameId}>Study Plan</a> */}
                            {haveGetProBtn && ( // load xong rồi và không phải pro thì hiện
                                <a className={"option-get-pro"} href={genLinkPro(appInfo)}>
                                    Get Pro
                                </a>
                            )}
                            {isLearning && !isReview && (
                                <Link href={"/review/" + appInfo.appNameId}>
                                    <a>Review</a>
                                </Link>
                            )}
                            {isReview && (
                                <Link href={routesLearning}>
                                    <a>Learning</a>
                                </Link>
                            )}
                            <a href="/blog">Blog</a>
                            <div className="avt">
                                <UserAvatar appInfo={appInfo} pro={havePro} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="menu-btn-icon" onClick={() => setOpenMenu(true)}>
                            <MenuIcon />
                        </div>
                        <SwipeableDrawer
                            className="v0-drawer-app-header-menu"
                            onClose={() => setOpenMenu(false)}
                            open={openMenu}
                            onOpen={() => setOpenMenu(true)}
                            anchor="right"
                        >
                            <MyContainer className="v0-drawer-menu-container">
                                <div className="v0-drawer-menu-container-top">
                                    <Link href="/">
                                        <a className="app-logo-in-drawer-menu">
                                            <img src={"/images/" + APP_SHORT_NAME + srcLogo} alt="logo" />
                                            {/* web cũ tạm lấy theo appShortName, web mới lấy theo bucket rồi*/}
                                        </a>
                                    </Link>
                                    <div className="close-drawer-menu-btn" onClick={() => setOpenMenu(false)}>
                                        <CloseIcon />
                                    </div>
                                </div>
                                <div className="v0-drawer-menu-option">
                                    <p>Menu</p>
                                    <Link href="/">
                                        <a>Home</a>
                                    </Link>
                                    {/* <a href={"/study-plan?appNameId=" + appInfo.appNameId}>Study Plan</a> */}
                                    {haveGetProBtn && ( // load xong rồi và không phải pro thì hiện
                                        <a className={"option-get-pro"} href={genLinkPro(appInfo)}>
                                            Get Pro
                                        </a>
                                    )}
                                    {isLearning && !isReview && (
                                        <Link href={"/review/" + appInfo.appNameId}>
                                            <a>Review</a>
                                        </Link>
                                    )}
                                    {isReview && (
                                        <Link href={routesLearning}>
                                            <a>Learning</a>
                                        </Link>
                                    )}
                                    <a href="/blog">Blog</a>
                                    <div className="avt">
                                        <UserAvatar appInfo={appInfo} pro={havePro} />
                                    </div>

                                    {haveGetProBtn && (
                                        <div className="drawer-menu-switch-theme">
                                            <SwitchTheme appInfo={appInfo} />
                                        </div>
                                    )}
                                    <DownloadAppV0 appInfo={appInfo} />
                                </div>
                            </MyContainer>
                        </SwipeableDrawer>
                    </>
                )}
            </MyContainer>
        </header>
    );
};

export default ClientHeader;
