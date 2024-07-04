import { isWebCDL } from "@/config/config_web";
import Link from "next/link";
import React from "react";

const AppLogo = ({ theme = "light" }: { theme?: string }) => {
    let srcLogo = "/images/easyprep/logo.svg";
    if (isWebCDL()) {
        srcLogo = "/images/cdl_v2/";
        if (theme === "light") {
            srcLogo += "logo-light.png";
        } else {
            srcLogo += "logo-dark.png";
        }
    }
    return (
        <Link href="/" prefetch={false}>
            <a>
                <img src={srcLogo} width={90} height={24} alt="logo" />
            </a>
        </Link>
    );
};

export default AppLogo;
