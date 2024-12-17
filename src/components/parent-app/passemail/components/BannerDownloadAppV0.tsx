import { ANDROID_STORE_PATH, IOS_STORE_PATH, isParentApp } from "@/config/config_web";
import { IAppInfo } from "@/models/AppInfo";
import { MAIN_COLOR, MAIN_COLOR_BOLD } from "@/config_app";
import * as ga from "../../services/ga";
import hexToRgbA from "@/utils/hexToRgba";
import QRCodeComponent from "../qr-code";
import "./BannerDownloadAppV0.scss";
import { validateEmail } from "@/utils";
import { POST } from "@/services/request";
import { useState } from "react";
import Config from "@/config";

const BannerDownloadAppV0 = ({
    appInfo,
    isMobile,
    theme,
    onClickStartNow,
}: {
    appInfo: IAppInfo;
    isMobile: boolean;
    onClickStartNow: (gaEvent: string) => void;
    theme?: string;
}) => {
    const _isParentApp = isParentApp();
    return (
        <div
            className={`cta-platform`}
            style={{
                backgroundColor: theme !== "dark" ? hexToRgbA(MAIN_COLOR, 0.04) : hexToRgbA(MAIN_COLOR, 0.2),
                border: "1px solid " + MAIN_COLOR_BOLD,
                boxShadow: `0px 0px 20px ${hexToRgbA(MAIN_COLOR_BOLD, 0.2)}, inset 0px 0px 50px ${hexToRgbA(
                    MAIN_COLOR_BOLD,
                    0.1
                )}`,
            }}
        >
            {!isMobile ? <GetAppFromQR appInfo={appInfo} isParentApp={_isParentApp} theme={theme} /> : <></>}

            <div className="choose-platform">
                <h2>Switch seamlessly between all your devices</h2>

                {isMobile ? <GetAppFromQR appInfo={appInfo} isParentApp={_isParentApp} theme={theme} /> : <></>}

                <div className="platform">
                    <a
                        href={"/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + ANDROID_STORE_PATH}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            ga.event({
                                action: "google_store_click",
                                params: {},
                            });
                        }}
                    >
                        <img src="/images/passemall/download_android.png" loading="lazy" />
                    </a>

                    <a
                        href={"/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + IOS_STORE_PATH}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            ga.event({
                                action: "app_store_click",
                                params: {},
                            });
                        }}
                    >
                        <img src="/images/passemall/download_ios.png" loading="lazy" />
                    </a>

                    {!isMobile ? (
                        <a>
                            <img
                                src="/images/passemall/web-play.png"
                                onClick={() => {
                                    onClickStartNow("diagnostic_start_browser_home");
                                }}
                                loading="lazy"
                            />
                        </a>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="ip-img">
                <img src={"/images/passemall/iPhone-14-Pro.png"} loading="lazy" />
            </div>
        </div>
    );
};

const GetAppFromQR = ({ appInfo, isParentApp, theme }: { appInfo: IAppInfo; isParentApp?: boolean; theme: string }) => {
    const isDark = theme === "dark";
    const [valueEmail, setValueEmail] = useState("");
    // const dispatch = useDispatch();
    const handleClickTextMe = async () => {
        try {
            if (validateEmail(valueEmail)) {
                // sendEmailDownloadApp(appInfo, valueEmail); //không hiểu sao import cái này vào thì lại bị xung đột vs file scss nên tạm viết như này ???
                await POST({
                    url: "https://micro-enigma-235001.appspot.com/api/auth?type=send-email-download-app",
                    params: {
                        email: valueEmail,
                        appName: appInfo.appName,
                        linkContent: `<div>${appInfo.appName} Prep app for Android >> <a href="${appInfo.linkAndroid}">here</a></div><div>${appInfo.appName} Prep app for IOS >> <a href="${appInfo.linkIos}">here</a></div>`,
                    },
                });
                // dispatch(setMessageAction("Email sent", "success")); // snackbar
                ga.event({ action: "send_email_download_app", params: {} });
                setValueEmail("");
            } else {
                // dispatch(setMessageAction("Email invalid", "error"));
            }
        } catch (error) {
            console.log("error", error);
        }
    };
    return (
        <div className="get-app-from-email-or-qr">
            <QRCodeComponent appInfo={appInfo} isParentApp={isParentApp} />
            <div>
                <input
                    type={"email"}
                    value={valueEmail}
                    name="give-email"
                    placeholder="Enter your email"
                    onChange={(event) => setValueEmail(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key == "Enter") {
                            handleClickTextMe();
                        }
                    }}
                />
                <button style={{ background: MAIN_COLOR }} type="submit" onClick={() => handleClickTextMe()}>
                    Send App Link
                </button>
            </div>
            <span className="get-app-text">
                Scan <b>QR code</b> or get instant <b>email</b> to install app
            </span>
        </div>
    );
};

export default BannerDownloadAppV0;
