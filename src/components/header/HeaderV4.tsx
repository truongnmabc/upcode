import dynamic from "next/dynamic";
import { useState } from "react";
import { APP_SHORT_NAME } from "../../config_app";
import * as ga from "../../services/ga";
import { IAppInfo } from "../../models/AppInfo";
import "./HeaderV4.scss";
import { ITopic } from "../../models/Topic";
import MyContainer from "../v4-material/MyContainer";
import CloseIcon from "../icon/CloseIcon";
import MenuIcon from "../icon/MenuIcon";
import ExpandMoreIcon from "../icon/ExpandMoreIcon";
import Link from "next/link";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { ITestInfo } from "@/models/TestInfo";
import states from "../../data/statesName.json";
import { getLink } from "@/utils";
const DownloadAppV4 = dynamic(() => import("../homepage/DownloadAppV4"));

const HeaderV4 = ({
    appInfo,
    topics,
    tests,
}: {
    appInfo: IAppInfo;
    tests: ITestInfo[];
    topics: ITopic[]; // cần truyền và cái này để trang Home không cần phụ thuộc vào redux nữa => tránh mount 2 lần và bị nháy màn hình khi truy cập (do logic của file LayoutV4)
}) => {
    const [openMenuDrawer, setOpenMenuDrawer] = useState(false);
    const getSrcLogo = () => {
        let logo = `/images/${APP_SHORT_NAME}/logo-light.png`;
        return logo;
    };
    return (
        <div className="container-header-v4">
            <MyContainer className="header-v4">
                <div className="logo-header-v4">
                    <Link href="/">
                        <img src={getSrcLogo()} alt={"logo-" + APP_SHORT_NAME} />
                    </Link>
                </div>
                <div
                    className="header-menu-v4"
                    onClick={() => {
                        setOpenMenuDrawer(true);
                        ga.event({
                            action: "click_menu_header",
                            params: {
                                from: window.location.href,
                            },
                        });
                    }}
                >
                    <span>Menu</span>
                    <MenuIcon />
                </div>
                <SwipeableDrawer
                    open={openMenuDrawer}
                    onClose={() => setOpenMenuDrawer(false)}
                    onOpen={() => {
                        setOpenMenuDrawer(true);
                    }}
                    anchor="right"
                    className="swipeable-drawer-header-v4"
                >
                    <div className="drawer-right-menu-header-v4 overflow-auto">
                        <div className="button-close-drawer-v4" onClick={() => setOpenMenuDrawer(false)}>
                            <CloseIcon />
                        </div>
                        <div className="container-drawer-right-menu-header-v4">
                            {appInfo.hasState && (
                                <>
                                    <div
                                        className="container-drawer-right-menu-header-v4-1"
                                        onClick={() => {
                                            let btn = document.getElementById("v4-icon-expand-state");
                                            let collapse = document.getElementById("collapse-state");
                                            let content = document.getElementById("collapse-content-state");
                                            let height = content.clientHeight;
                                            if (btn.className.includes("true")) {
                                                //close
                                                btn.className = "v4-icon-expand false";
                                                collapse.style.height = "0px";
                                            } else {
                                                btn.className = "v4-icon-expand true";
                                                collapse.style.height = height + "px";
                                            }
                                        }}
                                    >
                                        Change your state?
                                        <div className={"v4-icon-expand"} id="v4-icon-expand-state">
                                            <ExpandMoreIcon />
                                        </div>
                                    </div>
                                    <div id="collapse-state">
                                        <div id="collapse-content-state" className="overflow-auto">
                                            {states[appInfo.appShortName].map((state, index) => {
                                                let _link = getLink(appInfo, state.tag);
                                                return (
                                                    <div key={index} className="v4-app-state">
                                                        <a
                                                            href={_link}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                ga.event({
                                                                    action: "click_menu_test",
                                                                    params: {
                                                                        from: window.location.href,
                                                                        to: _link,
                                                                    },
                                                                });
                                                                window.location.href = _link;
                                                            }}
                                                        >
                                                            {state.name}
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>{" "}
                                </>
                            )}
                            {tests.length > 0 && (
                                <>
                                    <div
                                        className="container-drawer-right-menu-header-v4-1"
                                        onClick={() => {
                                            let btn = document.getElementById("v4-icon-expand-test");
                                            let collapse = document.getElementById("collapse-test");
                                            let content = document.getElementById("collapse-content-test");
                                            let height = content.clientHeight;
                                            if (btn.className.includes("true")) {
                                                //close
                                                btn.className = "v4-icon-expand false";
                                                collapse.style.height = "0px";
                                            } else {
                                                btn.className = "v4-icon-expand true";
                                                collapse.style.height = height + "px";
                                            }
                                        }}
                                    >
                                        {`Full ${appInfo.appName} Practice Test`}
                                        <div className={"v4-icon-expand"} id="v4-icon-expand-test">
                                            <ExpandMoreIcon />
                                        </div>
                                    </div>
                                    <div id="collapse-test">
                                        <div id="collapse-content-test">
                                            {tests.map((test, index) => {
                                                let _link = test.slug;
                                                return (
                                                    <div key={index} className="v4-app-test">
                                                        <a
                                                            href={_link}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                ga.event({
                                                                    action: "click_menu_test",
                                                                    params: {
                                                                        from: window.location.href,
                                                                        to: test.tag,
                                                                    },
                                                                });
                                                                window.location.href = _link;
                                                            }}
                                                        >
                                                            {`${test.title} Test`}
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}

                            {topics.length > 0 && (
                                <>
                                    <div
                                        className="container-drawer-right-menu-header-v4-1"
                                        onClick={() => {
                                            let btn = document.getElementById("v4-icon-expand");
                                            let collapse = document.getElementById("collapse-topic");
                                            let content = document.getElementById("collapse-content");
                                            let height = content.clientHeight;
                                            if (btn.className.includes("true")) {
                                                //close
                                                btn.className = "v4-icon-expand false";
                                                collapse.style.height = "0px";
                                            } else {
                                                btn.className = "v4-icon-expand true";
                                                collapse.style.height = height + "px";
                                            }
                                        }}
                                    >
                                        {`${appInfo.appName} Topics`}{" "}
                                        <div className={"v4-icon-expand"} id="v4-icon-expand">
                                            <ExpandMoreIcon />
                                        </div>
                                    </div>
                                    <div id="collapse-topic">
                                        <div id="collapse-content">
                                            {topics.map((topic) => {
                                                let _link = topic.slug;
                                                return (
                                                    <div key={topic.id} className="v4-app-topic">
                                                        <a
                                                            href={_link}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                ga.event({
                                                                    action: "click_menu_topic",
                                                                    params: {
                                                                        from: window.location.href,
                                                                        to: topic.tag,
                                                                    },
                                                                });
                                                                window.location.href = _link;
                                                            }}
                                                        >
                                                            {topic.name}
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="container-drawer-right-menu-header-v4-1">
                                <a
                                    // prefetch={false}
                                    href={"/blog"}
                                >{`${appInfo.appName} Blog`}</a>
                            </div>

                            <div className="container-drawer-right-menu-header-v4-2">
                                <div>Available on Android and Apple devices</div>
                                <DownloadAppV4 appInfo={appInfo} place="menu" />
                            </div>
                        </div>
                    </div>
                </SwipeableDrawer>
                {/* <MySwipeableDrawer
                    open={openMenuDrawer}
                    onClose={() => setOpenMenuDrawer(false)}
                    className="drawer-right-menu-header-v4"
                >
                    
                </MySwipeableDrawer> */}
            </MyContainer>
        </div>
    );
};

export default HeaderV4;
