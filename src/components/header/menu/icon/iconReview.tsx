"use client";
import RouterApp from "@/router/router.constant";
import IconReview from "@/components/icon/iconReview";
import NextLink from "@/components/nextLink";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React from "react";

const IconReviewHeader = () => {
    const pathname = usePathname();
    if (pathname.includes("/study")) {
        return (
            <NextLink href={RouterApp.Review}>
                <div className="hidden sm:flex item-center hover:text-primary  capitalize gap-3">
                    <IconReview />
                    <div
                        className={clsx(
                            "text-base font-normal cursor-pointer text-[var(--text-color)] hover:text-primary"
                        )}
                    >
                        Review
                    </div>
                </div>
            </NextLink>
        );
    }
    return <></>;
};

export default IconReviewHeader;
