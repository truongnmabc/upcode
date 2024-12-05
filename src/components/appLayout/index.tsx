import FooterApp from "@/components/footer";
import HeaderApp from "@/components/header";
import React, { Fragment } from "react";
import SheetApp from "../sheetApp";
import WrapperScroll from "./wrapperScroll";

const FN = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <WrapperScroll>
        <HeaderApp />
        <div className="flex-1 flex flex-col bg-theme-white dark:bg-theme-dark  justify-between">
          <div className="flex-1">{children}</div>
          <FooterApp />
        </div>
        <SheetApp />
      </WrapperScroll>
    </Fragment>
  );
};

const AppLayout = React.memo(FN);

export default AppLayout;
