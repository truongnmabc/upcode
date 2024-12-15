"use client";
import { usePathname } from "next/navigation";
import React from "react";

export const extractKey = (pathname: string): string | null => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 3 && parts[2].endsWith("-practice-test")) {
        const key = parts[2].replace("-practice-test", "");
        return key.replaceAll("-", " ");
    }
    return null;
};

const TitleQuestion = () => {
    const pathname = usePathname();
    const defaultTitle = extractKey(pathname);

    return (
        <div className="w-full text-center capitalize text-xl font-semibold">
            {defaultTitle}
        </div>
    );
};

export default React.memo(TitleQuestion);
