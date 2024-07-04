import Config from "@/config";
import { getSession, isProduction, isWebCDL } from "@/config/config_web";

// const HorizontalBannerAds = () => {
//     console.log("HorizontalBannerAds");

//     return (
//         <>
//             <ins
//                 className="adsbygoogle"
//                 style={{ display: "block" }}
//                 data-ad-client="ca-pub-2131195938375129"
//                 data-ad-slot="9812116074"
//                 data-ad-format="auto"
//                 data-full-width-responsive="true"
//             ></ins>
//             <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }}></script>
//         </>
//     );
// };

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

function getAdClientId() {
    if (isWebCDL()) {
        return "ca-pub-3656400522603089"; // cdl, passemall, teas, ged,cna
    }
    return "";
}

function hasAds() {
    return isProduction() && isWebCDL();
}

function addLinkAdsen() {
    return hasAds() || isProduction();
}

const hasShowAds = () => {
    const tester = getSession(Config.TESTER_KEY);
    return tester || hasAds();
};

const isAdsGoogle = () => {
    return isWebCDL();
};

function getAdsId(name) {
    // passemall
    return {
        LearnAdsMobileBeforeNavigation: "3453850342",
        BlogAdsRightSidebar: "7193784800",
        BlogAdsBeforeArticleList: "7570216992",
        LearnAdsLeftSidebar: "7712659551",
        LearnAdsAfterHeader: "2126318623",
        LearnAdsBottom: "5880455057",
        TestAdsAfterHeader: "9053413301",
        TestAdsLeftSidebar: "9053413301",
        TestAdsBottom: "9983351597",
        HomeAdsAfterTopics: "6818380284",
        HomeAdsAfterTests: "5143719422",
    }[name];
}
export { getAdClientId, hasAds, addLinkAdsen, checkCountryVN, hasShowAds, isAdsGoogle, getAdsId };
