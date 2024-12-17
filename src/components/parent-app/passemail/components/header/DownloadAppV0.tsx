import "./DownloadAppV0.scss";
import React from "react";
import Ios from "@/components/icon/Ios";
import Android from "@/components/icon/Android";
import { ANDROID_STORE_PATH, IOS_STORE_PATH } from "@/config/config_web";
import { IAppInfo } from "@/models/AppInfo";

const DownloadAppV0 = ({ appInfo }: { appInfo: IAppInfo }) => {
    return (
        <div className="download-app-v0">
            <a
                className="get-on-the-google-play"
                href={"/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + IOS_STORE_PATH}
            >
                <Ios />
                <div>
                    <span>Get on the</span>
                    <p>Google Play</p>
                </div>
            </a>
            <a
                className="get-on-the-app-store"
                href={"/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + ANDROID_STORE_PATH}
            >
                <Android />
                <div>
                    <span>Get on the</span>
                    <p>App Store</p>
                </div>
            </a>
        </div>
    );
};

export default DownloadAppV0;
