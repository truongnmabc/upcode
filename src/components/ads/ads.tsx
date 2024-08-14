import Config from "@/config";
import { getSession, isWebEASYPREP } from "@/config/config_web";

const HorizontalBannerAds = () => {
    return (
        <>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-2131195938375129"
                data-ad-slot="9812116074"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
            <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }}></script>
        </>
    );
};
function getAdClientId() {
    if (isWebEASYPREP()) {
        return "ca-pub-2131195938375129";
    }
    return "";
}

const checkCountryVN = () => {
    let currentCountry = localStorage.getItem("country");
    let clickAds = 0;
    try {
        clickAds = parseInt(localStorage.getItem(Config.KEY_CLICK_ADS));
    } catch (error) {
        clickAds = 0;
    }
    if (clickAds >= Config.MAX_CLICK_ADS_PER_USER) {
        return true;
    }
    const MAX_TIMES_DISPLAY_ADS = Config.MAX_TIMES_DISPLAY_ADS;
    const total = getSession(Config.COUNT_ADS_KEY);
    let totalCount = 0;
    if (total) {
        totalCount = parseInt(total);
    }
    if (totalCount > MAX_TIMES_DISPLAY_ADS) {
        return true;
    }
    console.log("Your current country:", currentCountry);

    return currentCountry == "VN";
};

export const isRemoveAds = (paymentInfo: any) => {
    return false;
};

export { HorizontalBannerAds, getAdClientId };
