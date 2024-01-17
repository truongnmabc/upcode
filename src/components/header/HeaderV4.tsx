import dynamic from "next/dynamic";
import { useState } from "react";
import { APP_SHORT_NAME } from "../../config_app";
// import * as ga from "../../lib/ga";
import { IAppInfo } from "../../models/AppInfo";
import "./HeaderV4.scss";
import MySwipeableDrawer from "../v4-material/MySwipeableDrawer";
import { ITopic } from "../../models/Topic";
import MyContainer from "../v4-material/MyContainer";
import CloseIcon from "../icon/CloseIcon";
import MenuIcon from "../icon/MenuIcon";
import ExpandMoreIcon from "../icon/ExpandMoreIcon";

const DownloadAppV4 = dynamic(() => import("../homepage-v4/DownloadAppV4"));

const HeaderV4 = ({
    appInfo,
    topics,
}: {
    appInfo: IAppInfo;
    topics: ITopic[]; // cần truyền và cái này để trang Home không cần phụ thuộc vào redux nữa => tránh mount 2 lần và bị nháy màn hình khi truy cập (do logic của file LayoutV4)
}) => {
    const [openMenuDrawer, setOpenMenuDrawer] = useState(false);
    const getSrcLogo = () => {
        let logo = `/images/${APP_SHORT_NAME}/logo-light.png`;
        return logo;
    };
    const appTopics = topics;
    return (
        <div className="container-header-v4">
            <MyContainer className="header-v4">
                <a href="/" className="logo-header-v4">
                    <img src={getSrcLogo()} alt={"logo-" + APP_SHORT_NAME} />
                </a>
                <div
                    className="header-menu-v4"
                    onClick={() => {
                        setOpenMenuDrawer(true);
                        // ga.event({
                        //     action: "click_menu_header",
                        //     params: {
                        //         from: window.location.href,
                        //     },
                        // });
                    }}
                >
                    <span>Menu</span>
                    <MenuIcon />
                </div>
                <MySwipeableDrawer
                    open={openMenuDrawer}
                    onClose={() => setOpenMenuDrawer(false)}
                    className="drawer-right-menu-header-v4"
                >
                    <div className="button-close-drawer-v4" onClick={() => setOpenMenuDrawer(false)}>
                        <CloseIcon />
                    </div>
                    <div className="container-drawer-right-menu-header-v4">
                        <div className="container-drawer-right-menu-header-v4-1">
                            <a
                                href={`/full-length-${appInfo.appShortName}-practice-test`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    // ga.event({
                                    //     action: "click_menu_full_test",
                                    //     params: {
                                    //         from: window.location.href,
                                    //     },
                                    // });
                                    window.location.href = `/full-length-${appInfo.appShortName}-practice-test`;
                                }}
                            >
                                {`Full ${appInfo.appName} Practice Test`}
                            </a>
                        </div>
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
                                {appTopics.map((topic) => {
                                    return (
                                        <div key={topic.id} className="v4-app-topic">
                                            <a
                                                href={`/${APP_SHORT_NAME}-${topic.tag}-practice-test`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // ga.event({
                                                    //     action: "click_menu_topic",
                                                    //     params: {
                                                    //         from: window.location.href,
                                                    //         to: topic.tag,
                                                    //     },
                                                    // });
                                                    window.location.href = `/${APP_SHORT_NAME}-${topic.tag}-practice-test`;
                                                }}
                                            >
                                                {topic.name}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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
                </MySwipeableDrawer>
            </MyContainer>
        </div>
    );
};

export default HeaderV4;
