"use client";
import CloseIcon from "@/asset/icon/CloseIcon";
import RouterApp from "@/common/router/router.constant";
import IconLinkStoreApp from "@/components/iconLinkStoreApp";
import { appInfoState } from "@/redux/features/appInfo";
import { userState } from "@/redux/features/user";
import { useAppSelector } from "@/redux/hooks";
import { trackingEventGa4 } from "@/services/googleEvent";
import { revertPathName } from "@/utils/pathName";
import { Drawer } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import ItemDrawerFullTest from "./itemDrawer";
import ListStudyDrawer from "./listStudy";

type IList = {
  handleClick: () => void;
  name: string;
};

const FN = ({
  openMenuDrawer,
  setOpenMenuDrawer,
}: {
  openMenuDrawer: boolean;
  setOpenMenuDrawer: (e: boolean) => void;
}) => {
  const {} = useAppSelector(userState);
  const { appInfo } = useAppSelector(appInfoState);
  const router = useRouter();

  const list: IList[] = [
    {
      name: "Score Calculator",
      handleClick: () => {
        setOpenMenuDrawer(false);
        router.push(
          revertPathName({
            href: RouterApp.Score_Calculator,
            appName: appInfo.appShortName,
          })
        );
      },
    },
    {
      name: "Study Guides",
      handleClick: () => {
        setOpenMenuDrawer(false);
        router.push(
          revertPathName({
            href: RouterApp.Study_Guides,
            appName: appInfo.appShortName,
          })
        );
      },
    },
    {
      name: "Blog",
      handleClick: () => {
        setOpenMenuDrawer(false);
        router.push(
          revertPathName({
            href: RouterApp.Blog,
            appName: appInfo.appShortName,
          })
        );
      },
    },
    {
      name: "Contact",
      handleClick: () => {
        setOpenMenuDrawer(false);
        router.push(
          revertPathName({
            href: RouterApp.Contacts,
            appName: appInfo.appShortName,
          })
        );
      },
    },
  ];

  return (
    <Drawer
      open={openMenuDrawer}
      onClose={() => setOpenMenuDrawer(false)}
      anchor="right"
      sx={{
        width: { xs: "300px", sm: "456px" }, // Sử dụng Material-UI breakpoints
        "& .MuiDrawer-paper": {
          width: { xs: "300px", sm: "456px" },
        },
      }}
    >
      <div className="bg-theme-white flex flex-col   p-3 w-full h-full overflow-auto">
        <div
          className="p-2 rounded-full cursor-pointer w-fit h-fit hover:bg-[#2121211f]"
          onClick={() => setOpenMenuDrawer(false)}
        >
          <CloseIcon color="rgba(0, 0, 0, 0.87)" />
        </div>
        <ItemDrawerFullTest
          name={`Full ${appInfo?.appName} Practice Test`}
          handleClick={() => {
            trackingEventGa4({
              eventName: "click_menu_full_test",
              value: {
                from: window.location.href,
              },
            });
            setOpenMenuDrawer(false);

            router.push(
              revertPathName({
                href: `/final_test/full-length-${appInfo?.appShortName}-practice-test`,
                appName: appInfo.appShortName,
              })
            );
          }}
        />

        <ListStudyDrawer setOpenMenuDrawer={setOpenMenuDrawer} />
        {list.map((item) => (
          <ItemDrawerFullTest
            key={item.name}
            name={item.name}
            handleClick={item.handleClick}
          />
        ))}
        <div className="flex p-3 flex-col gap-2">
          <p className="text-sm  font-normal">
            Available on Android and Apple devices
          </p>
          <div className="flex items-center gap-2">
            <IconLinkStoreApp
              type="ios"
              classNames="w-[120px] h-[35px] sm:w-[120px] sm:h-[35px]"
            />
            <IconLinkStoreApp
              type="android"
              classNames="w-[120px] h-[35px] sm:w-[120px] sm:h-[35px]"
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const DrawerHeader = React.memo(FN);

export default DrawerHeader;
