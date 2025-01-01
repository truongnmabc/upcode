import FooterApp from "@/components/footer/FooterLandingV4";
import HeaderApp from "@/components/header";
import React from "react";
import { ToastContainer } from "react-toastify";
import AdsProvider from "../ads/adsProvider";
import SheetApp from "../sheetApp";
import { NavigationEvents } from "./navigationEvents";
import { ProgressBar } from "./progressBar";
import AuthProvider from "./authProvider";
import WrapperScroll from "./wrapperScroll";
import SyncData from "../sync";
const FN = ({ children }: { children: React.ReactNode }) => {
    return (
        <WrapperScroll>
            <ProgressBar className="fixed z-50 top-0 h-1 bg-sky-500">
                <NavigationEvents />
            </ProgressBar>
            <HeaderApp />
            <div className="flex-1 flex flex-col bg-theme-white dark:bg-theme-dark  justify-between">
                {children}
                <FooterApp />
            </div>
            <ToastContainer autoClose={2000} />
            <SheetApp />
            <AuthProvider />
            <AdsProvider />
            <SyncData />
        </WrapperScroll>
    );
};

const AppLayout = React.memo(FN);

export default AppLayout;
