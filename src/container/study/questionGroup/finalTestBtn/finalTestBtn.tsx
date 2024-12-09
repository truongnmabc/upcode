"use client";

import RouterApp from "@/common/router/router.constant";
import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React from "react";

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);

  const path = revertPathName({
    href: RouterApp.Test,
    appName: appInfo.appShortName,
  });

  const router = useRouter();

  return (
    <MtUiButton
      block
      type="primary"
      onClick={() => {
        router.push(path);
      }}
    >
      <p className="text-base capitalize font-semibold text-white">
        {appInfo.appShortName} Final Test
      </p>
    </MtUiButton>
  );
};
const FinalTestBtn = React.memo(FN);
export default FinalTestBtn;
