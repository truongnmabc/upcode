"use client";

import "./ParentAppHeaderV0.scss";
import { useState } from "react";
import dynamic from "next/dynamic";
// import MyContainer from "@/components/v4-material/MyContainer";
import Link from "next/link";

const SwipeableDrawer = dynamic(() => import("@mui/material/SwipeableDrawer"), {
    ssr: false,
});
// const MenuIcon = dynamic(() => import("@/components/icon/MenuIcon"), { ssr: false });
// const CloseIcon = dynamic(() => import("@/components/icon/CloseIcon"), { ssr: false });

const ParentAppHeaderV0 = ({ isDesktop }: { isDesktop: boolean }) => {
    const srcLogoPassemall = "images/passemall/logo-light.png";
    const [showMenuHeader, setShowMenuHeader] = useState(false);

    return (
        <>
            <header className="container-header-v0">
                {/* <MyContainer>
                    <div className="header-v0">
                        <a href={"/"}>
                            <img className="logo-app" src={srcLogoPassemall} alt="logo" />
                        </a>
                        {isDesktop ? (
                            <div className="header-navigation-right-v0">
                                <Link href={"/"}>
                                    <a className="link">Home</a>
                                </Link>
                                <a href="/blog" className="link">
                                    Blog
                                </a>
                            </div>
                        ) : (
                            <>
                                <div className="icon-menu-v0" onClick={() => setShowMenuHeader(true)}>
                                    <MenuIcon color="black" />
                                </div>

                                <SwipeableDrawer
                                    className="swipeable-drawer-v0"
                                    open={showMenuHeader && !isDesktop}
                                    onOpen={() => setShowMenuHeader(true)}
                                    onClose={() => setShowMenuHeader(false)}
                                    anchor="right"
                                >
                                    <div className="swipeable-drawer-container-v0">
                                        <div className="swipeable-drawer-header-v0">
                                            <img
                                                className="logo-app"
                                                src={srcLogoPassemall}
                                                width={102}
                                                height={24}
                                                alt="logo"
                                            />
                                            <div className="button-close-drawer-v0" onClick={() => setShowMenuHeader(false)}>
                                                <CloseIcon />
                                            </div>
                                        </div>
                                        <div className="swipeable-drawer-content-v0">
                                            <span className="text-menu">Menu</span>
                                            <Link href="/">
                                                <a className="text-navigation">
                                                    <span>Home</span>
                                                </a>
                                            </Link>
                                            <a href="/blog" className="text-navigation">
                                                <span>Blog</span>
                                            </a>
                                        </div>
                                    </div>
                                </SwipeableDrawer>
                            </>
                        )}
                    </div>
                </MyContainer> */}
            </header>
            <div>123123</div>
        </>
    );
};

export default ParentAppHeaderV0;
