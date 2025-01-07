"use client";

import IconBack from "@/components/icon/iconBack";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";

import dynamic from "next/dynamic";
import { getKeyTest, getLastPathSegment } from "../titleQuestion";

const MobileDrawerConfirmExit = dynamic(
    () => import("./mobileDrawerConfirmExit"),
    {
        ssr: false,
    }
);
const HeaderStudy = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const { indexCurrentQuestion, listQuestion, type, indexSubTopic } =
        useAppSelector(gameState);
    const param = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const defaultTitle =
        getKeyTest(param?.slug) || getLastPathSegment(pathname);
    return (
        <Fragment>
            <div className="flex sm:hidden items-center mt-2 px-2 justify-between w-full">
                <div
                    onClick={() => {
                        if (type === "test") {
                            setOpenDrawer(!openDrawer);
                        } else {
                            router.back();
                        }
                    }}
                    className="cursor-pointer"
                >
                    <IconBack size={20} />
                </div>

                <div className=" text-center flex-1 capitalize text-lg font-medium">
                    {type === "learn" ? `Core ${indexSubTopic}` : defaultTitle}
                </div>
                <div className=" text-sm font-normal ">
                    {indexCurrentQuestion + 1}/{listQuestion?.length}
                </div>
            </div>
            <MobileDrawerConfirmExit
                open={openDrawer}
                setOpen={setOpenDrawer}
            />
        </Fragment>
    );
};

export default React.memo(HeaderStudy);
