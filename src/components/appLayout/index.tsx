import FooterApp from "@/components/footer/FooterLandingV4";
import HeaderApp from "@/components/header";
import React, { Fragment } from "react";
import SheetApp from "../sheetApp";
import WrapperScroll from "./wrapperScroll";
import { ProgressBar } from "./progressBar";
import { NavigationEvents } from "./navigationEvents";

const FN = ({ children }: { children: React.ReactNode }) => {
    return (
        <Fragment>
            <WrapperScroll>
                <ProgressBar className="fixed z-50 top-0 h-1 bg-sky-500">
                    <NavigationEvents />
                </ProgressBar>

                <HeaderApp />
                <div className="flex-1 flex flex-col bg-theme-white dark:bg-theme-dark  justify-between">
                    {children}
                    <FooterApp />
                </div>
                <SheetApp />
            </WrapperScroll>
        </Fragment>
    );
};

const AppLayout = React.memo(FN);

export default AppLayout;
