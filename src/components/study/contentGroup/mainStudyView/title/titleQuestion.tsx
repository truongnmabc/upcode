"use client";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";

export const extractKey = (pathname: string): string | null => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 3 && parts[2].endsWith("-practice-test")) {
        const key = parts[2].replace("-practice-test", "");
        return key.replaceAll("-", " ");
    }
    return null;
};

const getKeyTest = (pathname: string | string[] | undefined): string | null => {
    if (!pathname) return null;
    if (typeof pathname === "string") return decodeURI(pathname);
    return decodeURI(pathname[pathname?.length - 1]);
};
const TitleQuestion = () => {
    const pathname = usePathname();
    const param = useParams();

    const type = useSearchParams().get("type");
    const defaultTitle =
        type === "test" ? getKeyTest(param?.slug) : extractKey(pathname);

    return (
        <div className="w-full text-center capitalize text-xl font-semibold">
            {defaultTitle}
        </div>
    );
};

export default React.memo(TitleQuestion);
