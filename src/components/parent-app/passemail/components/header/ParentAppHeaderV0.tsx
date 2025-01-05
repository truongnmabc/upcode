"use client";

import "./ParentAppHeaderV0.scss";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import MyContainer from "@/components/container";
import { useIsMobile } from "@/hooks/useIsMobile";
import MenuIcon from "@/asset/icon/MenuIcon";
import CloseIcon from "@/asset/icon/CloseIcon";

const SwipeableDrawer = dynamic(() => import("@mui/material/SwipeableDrawer"), {
    ssr: false,
});

const ParentAppHeaderV0 = () => {
    const srcLogoPassemall = "images/passemall/logo-light.png";
    const [showMenuHeader, setShowMenuHeader] = useState(false);
    const isMobile = useIsMobile();
    return (
        <>
            <header className="container-header-v0">
                <MyContainer>
                    <div className="header-v0">
                        <Link href={"/"}>
                            <img
                                className="logo-app"
                                src={srcLogoPassemall}
                                alt="logo"
                            />
                        </Link>
                        {!isMobile ? (
                            <div className="header-navigation-right-v0">
                                <Link href={"/"}>Home</Link>
                                <Link href="/blog" className="link">
                                    Blog
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div
                                    className="icon-menu-v0"
                                    onClick={() => setShowMenuHeader(true)}
                                >
                                    <MenuIcon color="black" />
                                </div>

                                <SwipeableDrawer
                                    className="swipeable-drawer-v0"
                                    open={showMenuHeader && isMobile}
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
                                            <div
                                                className="button-close-drawer-v0"
                                                onClick={() =>
                                                    setShowMenuHeader(false)
                                                }
                                            >
                                                <CloseIcon />
                                            </div>
                                        </div>
                                        <div className="swipeable-drawer-content-v0">
                                            <span className="text-menu">
                                                Menu
                                            </span>
                                            <Link href="/">
                                                <span className="text-navigation">
                                                    Home
                                                </span>
                                            </Link>
                                            <Link href="/blog">
                                                <span className="text-navigation">
                                                    Blog
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </SwipeableDrawer>
                            </>
                        )}
                    </div>
                </MyContainer>
            </header>
        </>
    );
};

export default ParentAppHeaderV0;
