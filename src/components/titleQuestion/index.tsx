"use client";
import { selectCurrentSubTopicIndex } from "@/redux/features/game.reselect";
import { setIsTester } from "@/redux/features/user";
import { selectIsTester } from "@/redux/features/user.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import clsx from "clsx";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export const getKeyTest = (
    pathname: string | string[] | undefined
): string | null => {
    if (!pathname) return null;
    if (typeof pathname === "string") {
        const name = pathname?.replace("-practice-test", "");
        return decodeURI(name.replaceAll("-", " ")?.replaceAll("_", " "));
    }
    return decodeURI(pathname[pathname?.length - 1]);
};

export const getLastPathSegment = (pathname?: string | null): string | null => {
    if (!pathname) {
        console.log("Pathname is empty");
        return null;
    }

    const segments = pathname?.split("/").filter(Boolean);

    const lastSegment =
        segments[segments.length - 1]?.replaceAll("_", " ") || null;

    return lastSegment;
};

const TitleQuestion = ({ type }: { type?: string }) => {
    const param = useParams();
    const pathname = usePathname();

    const defaultTitle =
        getKeyTest(param?.["slug"]) || getLastPathSegment(pathname);

    const index = useAppSelector(selectCurrentSubTopicIndex);
    const isTestTer = useAppSelector(selectIsTester);
    let tempCount = 0;
    const dispatch = useAppDispatch();
    const setIsTesterFn = () => {
        if (isTestTer) {
            dispatch(setIsTester(false));
            return;
        }
        tempCount++;
        if (tempCount == 0) {
            setTimeout(() => {
                tempCount = 0;
            }, 2000);
        }
        if (tempCount >= 3) {
            tempCount = 0;
            alert("♠️");
            dispatch(setIsTester(true));
        }
    };
    return (
        <div
            className={clsx(
                "w-full text-center hidden sm:block capitalize text-xl font-semibold"
            )}
            onClick={setIsTesterFn}
        >
            {defaultTitle} {type === "learn" ? `- Core ${index}` : ""}
        </div>
    );
};

export default React.memo(TitleQuestion);
