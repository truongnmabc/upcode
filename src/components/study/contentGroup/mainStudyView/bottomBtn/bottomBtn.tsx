import React from "react";
import BottomBtnSticky from "./bottomBtnSticky";
import Keyboard from "./keyboard";
import SubAction from "./subAction";

const BottomBtn = () => {
  return (
    <div className="flex fixed sm:static shadow-bottom sm:shadow-none  bottom-0 left-0 right-0 z-50 bg-theme-dark sm:px-4 sm:bg-[#7C6F5B0F] flex-col sm:flex-row pb-8 pt-3 sm:py-3 justify-between gap-2 sm:gap-4 items-center ">
      <div className="flex  gap-2 sm:gap-8 items-center">
        <Keyboard />
        <SubAction />
      </div>
      <div className="px-4 w-full sm:p-4 sm:w-fit">
        <BottomBtnSticky />
      </div>
    </div>
  );
};

export default BottomBtn;
