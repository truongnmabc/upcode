import { ANDROID_STORE_PATH, IOS_STORE_PATH } from "@/config/config_web";
import { IAppInfo } from "@/models/AppInfo";
import * as ga from "../../services/ga";
import "./StoreArchievement.scss";
// import useThemeCustom from "@/components/v4-material/useThemeCustom";

const StoreArchievement = ({ appInfo, reverse = false }: { appInfo: IAppInfo; reverse?: boolean }) => {
    // const { theme } = useThemeCustom();

    let isLight = true; // theme === "light";
    if (reverse) {
        isLight = false;
    }

    const icon1 = "/images/homeV0" + "/ggplay-icon-" + (isLight ? "light" : "dark") + ".png";
    const icon2 = "/images/homeV0" + "/gg-icon-" + (isLight ? "light" : "dark") + ".png";
    const icon3 = "/images/homeV0" + "/appstore-icon-" + (isLight ? "light" : "dark") + ".png";
    const rate1 = "/images/homeV0" + "/ggplay-rate-" + (isLight ? "light" : "dark") + ".png";
    const rate2 = "/images/homeV0" + "/gg-rate-" + (isLight ? "light" : "dark") + ".png";
    const rate3 = "/images/homeV0" + "/appstore-rate-" + (isLight ? "light" : "dark") + ".png";

    return (
        <div className="store-archievement-container">
            <div
                className="platform-wrapper"
                style={{
                    flex: 2,
                }}
                onClick={() => {
                    ga.event({
                        action: "cta_webV2_google_play_link",
                        params: {},
                    });
                    ga.event({
                        action: "google_store_click",
                        params: {},
                    });
                }}
            >
                <div className="img-wrapper">
                    <a target="_blank" rel="noreferrer" href={"/" + ANDROID_STORE_PATH}>
                        <img src={icon1} alt="" />
                    </a>
                </div>
                <div className="img-wrapper">
                    <a target="_blank" rel="noreferrer" href={"/" + ANDROID_STORE_PATH}>
                        <img src={rate1} alt="" />
                    </a>
                </div>
            </div>
            <div
                className="platform-wrapper"
                style={{
                    flex: 1,
                }}
            >
                <div className="img-wrapper">
                    <img src={icon2} alt="" />
                </div>

                <div className="img-wrapper">
                    <img src={rate2} alt="" />
                </div>
            </div>
            <div
                className="platform-wrapper"
                style={{
                    flex: 2,
                }}
                onClick={() => {
                    ga.event({
                        action: "cta_webV2_app_store_link",
                        params: {},
                    });
                    ga.event({
                        action: "app_store_click",
                        params: {},
                    });
                }}
            >
                <div className="img-wrapper">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href={"/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + IOS_STORE_PATH}
                    >
                        <img src={icon3} alt="" />
                    </a>
                </div>

                <div className="img-wrapper">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href={"/" + (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") + IOS_STORE_PATH}
                    >
                        <img src={rate3} alt="" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StoreArchievement;
