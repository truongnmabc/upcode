"use client";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import LazyLoadImage from "../images";

const TitleGetPro = () => {
    const { appInfo } = useAppSelector(appInfoState);
    return (
        <span className="text-[#59f5a9] ">
            {appInfo.appName}{" "}
            <span className="relative">
                Pro{" "}
                <LazyLoadImage
                    classNames=" absolute -top-1 right-5 w-6 h-6"
                    src="/images/passemall/new-pro/pro.png"
                />
            </span>
        </span>
    );
};

export default React.memo(TitleGetPro);
