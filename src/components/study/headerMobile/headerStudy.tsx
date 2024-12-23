"use client";

import IconBack from "@/components/icon/iconBack";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import MobileDrawerConfirmExit from "./mobileDrawerConfirmExit";

const HeaderStudy = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const { indexCurrentQuestion, listQuestion, type, indexSubTopic } =
        useAppSelector(gameState);

    const router = useRouter();

    return (
        <Fragment>
            <div className="flex sm:hidden items-center mt-2 justify-between w-full">
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
                    {type === "learn"
                        ? `Core ${indexSubTopic}`
                        : "Practice Tests"}
                </div>
                <div className=" text-sm font-normal ">
                    {indexCurrentQuestion + 1}/{listQuestion?.length}
                </div>
            </div>
            {/* *NOTE: cho nay loi  */}
            <div>
                <MobileDrawerConfirmExit
                    open={openDrawer}
                    setOpen={setOpenDrawer}
                />
            </div>
        </Fragment>
    );
};

export default React.memo(HeaderStudy);
