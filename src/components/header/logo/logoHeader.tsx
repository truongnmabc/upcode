"use client";
import RouterApp from "@/common/router/router.constant";
import LazyLoadImage from "@/components/images";
import { useTheme } from "@/lib/hooks/useTheme";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
import { convertPathName, revertPathName } from "@/utils/pathName";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
const FN = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const currentPath = convertPathName(pathname);
  const { theme } = useTheme();
  const { appInfo } = useAppSelector(appInfoState);
  return (
    <div
      className="h-full max-h-14 w-full flex items-center cursor-pointer"
      onClick={() => {
        if (currentPath === RouterApp.Home) return;
        push(
          revertPathName({
            href: RouterApp.Home,
            appName: appInfo.appShortName,
          })
        );
      }}
    >
      <LazyLoadImage
        src={`/images/logo/${theme == "dark" ? "logo-dark" : "logo-light"}.png`}
        classNames=" w-full max-w-[128px] max-h-14  sm:max-w-[160px]"
      />
    </div>
  );
};
const LogoHeader = React.memo(FN);
export default LogoHeader;
