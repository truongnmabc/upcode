"use client";
import CloseIcon from "@/asset/icon/CloseIcon";
import RouterApp from "@/common/router/router.constant";
import DownloadApp from "@/container/home/downloadApp/downloadApp";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { userState } from "@/lib/redux/features/user";
import { useAppSelector } from "@/lib/redux/hooks";
import { eventSendGA4 } from "@/lib/services/googleEvent";
import { revertPathName } from "@/utils/pathName";
import { Drawer } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import ItemDrawerFullTest from "./itemDrawer";

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
                        eventSendGA4({
                            eventName: "click_menu_full_test",
                            value: {
                                from: window.location.href,
                            },
                        });
                        setOpenMenuDrawer(false);

                        router.push(
                            revertPathName({
                                href: `/full-length-${appInfo?.appShortName}-practice-test`,
                                appName: appInfo.appShortName,
                            })
                        );
                    }}
                />
                {list.map((item) => (
                    <ItemDrawerFullTest
                        key={item.name}
                        name={item.name}
                        handleClick={item.handleClick}
                    />
                ))}
                <div className="flex flex-col gap-2">
                    <div>Available on Android and Apple devices</div>
                    <DownloadApp appInfo={appInfo} size="m" />
                </div>
            </div>
        </Drawer>
    );
};

const DrawerHeader = React.memo(FN);

export default DrawerHeader;
