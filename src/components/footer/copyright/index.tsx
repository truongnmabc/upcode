"use client";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
import React from "react";

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);
  const year = new Date().getFullYear();

  return (
    <div className="text-white text-center text-sm sm:text-xs sm:text-center w-fit py-2 sm:py-1 leading-relaxed">
      © {year} {appInfo.appName} Prep by ABC-Elearning. All rights reserved.
    </div>
  );
};

const CopyrightNote = React.memo(FN);
export default CopyrightNote;
