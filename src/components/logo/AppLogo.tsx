import Link from "next/link";
import React from "react";

const AppLogo = () => {
    let srcLogo = "/images/easy-prep/logo.svg";
    return (
        <Link href="/" prefetch={false}>
            <a>
                <img src={srcLogo} width={90} height={24} alt="logo" />
            </a>
        </Link>
    );
};

export default AppLogo;
