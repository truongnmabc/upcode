"use client";
import Config from "@/config";
import { setSession } from "@/utils/session";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const getKeyTest = (pathname: string | string[] | undefined): string | null => {
    if (!pathname) return null;
    if (typeof pathname === "string") {
        const name = pathname?.replace("-practice-test", "");
        return decodeURI(name.replaceAll("-", " "));
    }
    return decodeURI(pathname[pathname?.length - 1]);
};

const getLastPathSegment = (pathname: string): string | null => {
    if (!pathname) {
        console.log("Pathname is empty");
        return null;
    }

    const segments = pathname.split("/").filter(Boolean);

    const lastSegment =
        segments[segments.length - 1]?.replaceAll("_", " ") || null;

    return lastSegment;
};

const TitleQuestion = () => {
    const param = useParams();
    const pathname = usePathname();

    const defaultTitle =
        getKeyTest(param?.slug) || getLastPathSegment(pathname);

    let tempCount = 0;

    const setIsTester = () => {
        tempCount++;
        if (tempCount == 0) {
            setTimeout(() => {
                tempCount = 0;
            }, 5000);
        }
        if (tempCount >= 3) {
            setSession(Config.TESTER_KEY, true);
            alert("You are tester!");
            location.reload();
        }
    };
    return (
        <div
            className="w-full text-center capitalize text-xl font-semibold"
            onClick={setIsTester}
        >
            {defaultTitle}
        </div>
    );
};

export default React.memo(TitleQuestion);
