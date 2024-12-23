"use client";
import LazyLoadImage from "@/components/images";
import ModalLogin from "@/components/login";
import ctx from "@/utils/mergeClass";
import { Button, Menu, MenuItem } from "@mui/material";
import React, { Fragment, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { revertPathName } from "@/utils/pathName";
import { useAppSelector } from "@/redux/hooks";
import { appInfoState } from "@/redux/features/appInfo";
import RouterApp from "@/common/router/router.constant";

const FN = ({ classNames }: { classNames?: string }) => {
    const [openModal, setOpenModal] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const isPro = false;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { appInfo } = useAppSelector(appInfoState);
    const _href = revertPathName({
        appName: appInfo.appShortName,
        href: RouterApp.Billing,
    });

    const handleNavigate = () => {
        setAnchorEl(null);
        router.push(_href);
    };
    const handleLogout = () => {
        setAnchorEl(null);
        signOut();
    };

    const handleClose = () => setAnchorEl(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>): void =>
        setAnchorEl(event.currentTarget);

    if (!session) {
        return (
            <div className="hidden sm:block">
                <Button
                    onClick={() => {
                        setOpenModal(true);
                    }}
                    sx={{
                        textTransform: "capitalize",
                        ":hover": {
                            backgroundColor: "transparent",
                        },
                    }}
                    className="gap-3  items-center"
                >
                    <div
                        className={ctx(
                            "text-base font-normal hover-main-color cursor-pointer text-[#21212185]",
                            classNames
                        )}
                    >
                        Login
                    </div>
                </Button>
                <ModalLogin open={openModal} setOpen={setOpenModal} />
            </div>
        );
    }

    return (
        <Fragment>
            <div className="cursor-pointer" onClick={handleClick}>
                {isPro && (
                    <LazyLoadImage
                        classNames="absolute bottom-full left-2 w-[14px] h-[9px]"
                        src="images/header/crown.png"
                        alt="crown"
                        draggable={false}
                    />
                )}
                <LazyLoadImage
                    // classNames={`cursor-pointer flex bg-[#cca68b] rounded-full w-[30px] h-[30px] box-border  ${
                    //   isPro
                    //     ? "border-2 border-white outline outline-[2px] outline-[#f0bd3a]"
                    //     : ""
                    // }`}
                    classNames="w-8 h-8 "
                    imgClassNames="rounded-full"
                    src={session.user?.image || ""}
                    alt="avatar"
                    draggable={false}
                />
            </div>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleLogout}>
                    <div className="flex gap-2 items-center">
                        <LazyLoadImage
                            src="/common/header/logout.png"
                            classNames="w-6 h-6"
                            alt="billing"
                        />
                        <span>Log Out</span>
                    </div>
                </MenuItem>
                <MenuItem onClick={handleNavigate}>
                    <div className="flex gap-2 items-center">
                        <LazyLoadImage
                            src="/common/header/billing.png"
                            classNames="w-6 h-6"
                            alt="billing"
                        />
                        <span>Billing History</span>
                    </div>
                </MenuItem>
            </Menu>
        </Fragment>
    );
};
const LoginHeader = React.memo(FN);
export default LoginHeader;
