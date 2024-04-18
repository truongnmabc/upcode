import { ANDROID_STORE_PATH, IOS_STORE_PATH } from "../../config/config_web";
import { IAppInfo } from "../../models/AppInfo";
import * as ga from "../../services/ga";
import "./DownloadAppV4.scss";
const DownloadAppV4 = ({
    appInfo,
    direction = "row",
    size = "m",
    place,
}: {
    appInfo: IAppInfo;
    direction?: "col" | "row";
    size?: "s" | "m" | "l";
    place: string;
}) => {
    const sizeMap = {
        s: { w: 90, h: 26 },
        m: { w: 120, h: 35 },
        l: { w: 180, h: 52 },
    };
    return (
        <div className={"v4-platform-download-app " + direction}>
            {!!appInfo.linkIos && (
                <a
                    className="v4-button-animtaion"
                    href={"/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + IOS_STORE_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        ga.event({
                            action: "click_app_store",
                            params: {},
                        });
                        ga.event({
                            action: place + "_click_app_store",
                            params: {},
                        });
                    }}
                >
                    <img
                        src="/images/download_ios.webp"
                        // loading="lazy"
                        width={sizeMap[size].w}
                        height={sizeMap[size].h}
                        alt="ios_download"
                    />
                </a>
            )}
            {!!appInfo.linkAndroid && (
                <a
                    className="v4-button-animtaion"
                    href={"/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + ANDROID_STORE_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        ga.event({
                            action: "click_gg_store",
                            params: {},
                        });
                        ga.event({
                            action: place + "_click_gg_store",
                            params: {},
                        });
                    }}
                >
                    <img
                        src="/images/download_android.webp"
                        // loading="lazy"
                        alt="android_download"
                        height={sizeMap[size].h}
                        width={sizeMap[size].w}
                    />
                </a>
            )}
        </div>
    );
};

export default DownloadAppV4;
