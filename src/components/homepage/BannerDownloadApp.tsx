import { IAppInfo } from "../../models/AppInfo";
import QRCodeComponent from "../qr-code";
import "./BannerDownloadApp.scss";
import DownloadAppV4 from "./DownloadAppV4";

const BannerDownloadApp = ({ appInfo, device }: { appInfo: IAppInfo; device: "desktop" | "mobile" }) => {
    let features = [
        {
            title: "No internet required",
            icon: <img alt="No internet required" src="/images/v4-no-internet-required.webp" width={24} height={24} />,
            mobile: false,
        },
        {
            title: appInfo.totalQuestion - (appInfo.totalQuestion % 10) + "+ unique questions",
            icon: <img alt="unique questions" src="/images/v4-unique-questions.webp" width={24} height={24} />,
            mobile: true,
        },
        {
            title: "Easy to use",
            icon: <img alt="easy to use" src="/images/v4-easy-to-use.webp" width={24} height={24} />,
            mobile: false,
        },
        {
            title: "Instant feedback",
            icon: <img alt="Instant feedback" src="/images/v4-instant-feedback.webp" width={24} height={24} />,
            mobile: true,
        },
        {
            title: "No registration",
            icon: <img alt="No registration" src="/images/v4-no-registration.webp" width={24} height={24} />,
            mobile: false,
        },
        {
            title: appInfo.hasState ? "State Specific" : "Track passing probability",
            icon: (
                <img
                    alt={appInfo.hasState ? "State Specific" : "Track passing probability"}
                    src="/images/v4-track-passing-probability.webp"
                    width={24}
                    height={24}
                />
            ),
            mobile: true,
        },
    ];
    return (
        <div className={"v4-banner-download-app-0 v4-border-radius"}>
            <div className="v4-banner-download-app-1">
                <div className="v4-banner-download-app-11">
                    <figure className="v4-banner-download-app-background" />
                    <div className="v4-banner-download-app-content-0">
                        <div>
                            <strong>DOWNLOAD</strong> OUR APP
                        </div>

                        <div className="v4-banner-download-app-grid-feature-0">
                            {features.map((f) => {
                                if (!!f)
                                    return (
                                        <div className="grid-feature-item" key={f.title}>
                                            {f.icon}
                                            <span>{f.title}</span>
                                        </div>
                                    );
                            })}
                        </div>

                        <div className="grid-feature-item">
                            {features
                                .filter((f) => f?.mobile)
                                .map((f) => f.title)
                                .join(" - ")}
                        </div>

                        <div className="v4-banner-download-app-method-0">
                            <DownloadAppV4
                                appInfo={appInfo}
                                direction="col"
                                size={device == "desktop" ? "l" : "s"}
                                place="home"
                            />

                            <div className="v4-banner-download-app-method-qr">
                                <QRCodeComponent appInfo={appInfo} isParentApp={false} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="v4-banner-download-app-12">
                    <figure
                        style={{
                            "--img-mobile-url": `url(/images/${appInfo.bucket}/banner-download-app-mobile.png)`,
                            "--img-desktop-url": `url(/images/${appInfo.bucket}/banner-download-app-desktop.png)`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BannerDownloadApp;
