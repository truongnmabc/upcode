import React, { useEffect, useRef, useState } from "react";
import "./Header1.scss";
import ExpandMoreIcon from "../icon/ExpandMoreIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "../icon/MenuIcon";
import { IAppInfo } from "@/models/AppInfo";
import SearchIcon from "../icon/SearchIcon";
import CloseIcon from "../icon/CloseIcon";
import HeaderCategory from "../easy-prep/HeaderCategory";
import AppLogo from "../logo/AppLogo";
import Link from "next/link";
import * as ga from "../../services/ga";
import dynamic from "next/dynamic";
const SearchAppComponent = dynamic(() => import("./SearchAppComponent"), {
    ssr: false,
});
const Header1 = ({ listAppInfos }: { listAppInfos: IAppInfo[] }) => {
    const isDesktop = useMediaQuery("(min-width: 769px)");
    const [focusSearch, setFocusSearch] = useState(false);
    const [focusMenu, setFocusMenu] = useState(false);
    useEffect(() => {
        let nextEle = document.getElementById("__next");
        if (!!nextEle) {
            if (focusMenu || focusSearch) {
                nextEle.style.height = "-webkit-fill-available";
                nextEle.style.overflow = "hidden";
                document.body.style.overflow = "hidden";
            } else {
                nextEle.style.height = "100%";
                nextEle.style.overflow = "auto";
                document.body.style.overflow = "unset";
            }
        }
    }, [focusMenu, focusSearch]);
    return (
        <>
            <header className={`header-1-container`}>
                <div className="header-grid">
                    <div className="grid-frame -f1 align-center font-14">
                        <div className="menu-desktop align-center">
                            <HeaderMenu isDesktop={isDesktop} listAppInfos={listAppInfos} />
                        </div>

                        <div
                            className="menu-icon-mobile"
                            onClick={() => {
                                setFocusMenu(true);
                            }}
                        >
                            <MenuIcon />
                        </div>
                    </div>
                    <div className="grid-frame -f2 align-center">
                        <AppLogo />
                    </div>
                    <div className="grid-frame -f3 align-center">
                        <div className="search-desktop">
                            <SearchAppComponent listAppInfos={listAppInfos} isDesktop={isDesktop} />
                        </div>
                        <div
                            className="search-icon-mobile"
                            onClick={() => {
                                setFocusSearch(true);
                            }}
                        >
                            <SearchIcon />
                        </div>
                    </div>
                </div>
                <div
                    id="search-component-mobile"
                    style={{
                        opacity: !isDesktop && focusSearch ? 1 : 0,
                        height: !isDesktop && focusSearch ? "100vh" : 0,
                        width: !isDesktop && focusSearch ? "100vw" : 0,
                    }}
                >
                    {!isDesktop && focusSearch && (
                        <div className="search-component-mobile">
                            <div className="align-center">
                                <SearchAppComponent listAppInfos={listAppInfos} isDesktop={isDesktop} />
                                <div
                                    className="cancel-search-btn font-14"
                                    onClick={() => {
                                        setFocusSearch(false);
                                    }}
                                >
                                    Cancel
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    id="menu-component-mobile"
                    style={{
                        opacity: !isDesktop && focusMenu ? 1 : 0,
                        height: !isDesktop && focusMenu ? "100vh" : 0,
                        width: !isDesktop && focusMenu ? "100vw" : 0,
                    }}
                >
                    {!isDesktop && focusMenu && (
                        <div className="menu-component-mobile">
                            <div onClick={() => setFocusMenu(false)} style={{ marginBottom: "24px", padding: 16 }}>
                                <CloseIcon />
                            </div>
                            <HeaderMenu isDesktop={isDesktop} listAppInfos={listAppInfos} />
                        </div>
                    )}
                </div>
            </header>
            <div className="header-1-frame" />
        </>
    );
};

const HeaderMenu = ({ isDesktop, listAppInfos }: { isDesktop: boolean; listAppInfos: IAppInfo[] }) => {
    const [showCategory, setShowCategory] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <Link href="/">
                <a
                    className="header-1-menu -option-home"
                    onClick={(e) => {
                        ga.event({
                            action: "click_home",
                            params: { from: window.location.href },
                        });
                    }}
                >
                    Home
                </a>
            </Link>
            <Link href="/about-us" prefetch={false}>
                <a
                    className="header-1-menu -option-about"
                    onClick={(e) => {
                        ga.event({
                            action: "click_about_us",
                            params: { from: window.location.href },
                        });
                    }}
                >
                    About
                </a>
            </Link>
            <div
                ref={buttonRef}
                className={"header-1-menu -option-practice-test align-center " + (showCategory ? "active" : "")}
                onClick={() => {
                    if (!showCategory) setShowCategory(true);
                    else if (!isDesktop) setShowCategory(false);
                }}
                onMouseOver={() => {
                    if (!showCategory && isDesktop) setShowCategory(true);
                }}
            >
                Practice Tests
                <div className="icon align-center">
                    <ExpandMoreIcon />
                </div>
            </div>
            {isDesktop ? (
                showCategory && (
                    <div className="header-1-category-container-desktop">
                        <HeaderCategory
                            isDesktop={isDesktop}
                            listAppInfos={listAppInfos}
                            buttonRef={buttonRef}
                            hideMenu={() => setShowCategory(false)}
                        />
                    </div>
                )
            ) : (
                <HeaderCategory isDesktop={isDesktop} listAppInfos={listAppInfos} showCategory={showCategory} />
            )}
        </>
    );
};

export default Header1;
