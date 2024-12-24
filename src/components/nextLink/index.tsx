"use client";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { revertPathName } from "@/utils/pathName";
import Link, { LinkProps } from "next/link";
import React, { Fragment, useEffect, useState } from "react";

interface IProps extends LinkProps {
    children: React.ReactNode;
    href: string;
}

const FN: React.FC<IProps> = ({ children, href, ...rest }) => {
    const { appInfo } = useAppSelector(appInfoState);
    const [link, setLink] = useState("");
    useEffect(() => {
        if (appInfo.appShortName) {
            const _href = revertPathName({
                href,
                appName: appInfo.appShortName,
            });
            setLink(_href);
        }
    }, [appInfo.appShortName, href]);

    if (!link) return <Fragment>{children}</Fragment>;

    return (
        <Link href={link} scroll={false} {...rest}>
            {children}
        </Link>
    );
};
const NextLink = React.memo(FN);
export default NextLink;
