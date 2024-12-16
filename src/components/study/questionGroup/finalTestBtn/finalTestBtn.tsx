"use client";

import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React from "react";

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);

  const path = revertPathName({
    href: `/final_test/full-length-${appInfo?.appShortName}-practice-test`,
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
