import React from "react";
import "./index.scss";
import { IAppInfo } from "@/models/AppInfo";
import Link from "next/link";
import { genLinkPro } from "@/services/home.service";

const BtnRemove = ({ appInfo }: { appInfo: IAppInfo }) => {
    let linkPro = genLinkPro(appInfo);
    return (
        <div className="btn-remove">
            <Link href={linkPro}>
                <a>
                    <span>Remove ads</span>
                    <div className="icon-remove">
                        <img src="/images/icon-next-remove.svg" alt="" />
                    </div>
                </a>
            </Link>
        </div>
    );
};

export default BtnRemove;
