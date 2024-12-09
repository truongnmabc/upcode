"use client";
// import RouterApp from "@/common/router/router.constant";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
// import { revertPathName } from "@/utils/pathName";
// import { useRouter } from "next/navigation";
import React from "react";

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);

  // const path = revertPathName({
  //   href: RouterApp.Test,
  //   appName: appInfo.appShortName,
  // });

  // const router = useRouter();
  return (
    <div className="text-xl font-poppins capitalize font-semibold">
      Move {appInfo.appShortName} Tests
    </div>
  );
};

const GridTestsLeft = React.memo(FN);
export default GridTestsLeft;
