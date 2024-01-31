import { IAppInfo } from "../../models/AppInfo";
import "./StudyBannerDownloadApp.scss";
import DownloadAppV4 from "../homepage/DownloadAppV4";
import { getAppShortName } from "@/utils/getStudyLink";
const StudyBannerDownloadApp = ({
    appInfo,
    place,
}: {
    appInfo: IAppInfo;
    place: string; // place nay de check them vao tracking
}) => {
    return (
        <div className="v4-study-banner-download-app-0 v4-border-radius">
            <div className="v4-study-banner-download-app-content">
                <h2 className="v4-study-banner-download-app-content-title v4-font-semi-bold">{`Get all ${
                    appInfo.totalQuestion
                }+ ${appInfo.appName.toUpperCase()} exam-like questions with our mobile apps!`}</h2>
                <div className="_769">
                    <DownloadAppV4 appInfo={appInfo} direction="row" size="l" place={place} />
                </div>
            </div>
            <div
                className="v4-study-banner-download-app-thumbnail"
                style={{
                    backgroundImage: `url(/images/${getAppShortName(appInfo.appShortName)}/study-banner-download-app.png)`,
                }}
            />
            <div style={{ padding: "16px" }} className="__768">
                <DownloadAppV4 appInfo={appInfo} direction="row" size="m" place={place} />
            </div>
        </div>
    );
};

export default StudyBannerDownloadApp;
