import { useSelector } from "react-redux";
import AdSense from "react-adsense";
import "./ads-google.scss";
import AppState from "@/redux/appState";
import { checkCountryVN, getAdClientId, getAdsId, hasAds, isAdsGoogle } from "../ads";
import { getSession } from "@/config/config_web";
import Config from "@/config";
import BtnRemove from "../BtnRemove";

const tester = getSession(Config.TESTER_KEY);
export const LeftAdsHorizontal = () => {
    let isPro = useSelector((state: AppState) => state.userReducer.isPro);
    let appInfo = useSelector((state: AppState) => state.appInfoReducer.appInfo);
    let _hasAds = hasAds();
    let showAds = _hasAds && isClientSide() && !isPro; // && appInfo.usingFeaturePro;
    return (
        <>
            {showAds &&
                (isAdsGoogle()
                    ? !checkCountryVN() && (
                          <>
                              <AdSense.Google
                                  client={getAdClientId()}
                                  slot={getAdsId("LeftAdsHorizontalStudy")}
                                  style={{
                                      display: "block",
                                      width: "98%",
                                      height: "80vh",
                                  }}
                                  format=""
                              />
                              <BtnRemove appInfo={appInfo} />
                          </>
                      )
                    : tester && <div className="tester"></div>)}
        </>
    );
};

export const RightAdsHorizontal = () => {
    let isPro = useSelector((state: AppState) => state.userReducer.isPro);
    let appInfo = useSelector((state: AppState) => state.appInfoReducer.appInfo);
    let _hasAds = hasAds();
    let showAds = _hasAds && isClientSide() && !isPro; // && appInfo.usingFeaturePro;
    return (
        <>
            {showAds &&
                (isAdsGoogle()
                    ? !checkCountryVN() && (
                          <>
                              <AdSense.Google
                                  client={getAdClientId()}
                                  slot={getAdsId("RightAdsHorizontalStudy")}
                                  style={{
                                      display: "block",
                                      width: "98%",
                                      height: "80vh",
                                  }}
                                  format=""
                              />
                              <BtnRemove appInfo={appInfo} />
                          </>
                      )
                    : tester && <div className="tester"></div>)}
        </>
    );
};

export const HeaderLearnAdsView = () => {
    let isPro = useSelector((state: AppState) => state.userReducer.isPro);
    let _hasAds = hasAds();
    const id = "HeaderLearnAdsView";
    let showAds = _hasAds && isClientSide() && !isPro; // && appInfo.usingFeaturePro;

    return (
        <div className="main-ads-top-banner-container" id={id}>
            {showAds &&
                (isAdsGoogle()
                    ? !checkCountryVN() && (
                          <>
                              <div onClick={countClickAds}>
                                  <AdSense.Google
                                      client={getAdClientId()}
                                      slot={getAdsId("LearnAdsAfterHeader")}
                                      style={{
                                          display: "block",
                                          width: "98%",
                                          height: "90px",
                                      }}
                                      format=""
                                  />
                              </div>
                          </>
                      )
                    : tester && <div className="tester"></div>)}
        </div>
    );
};

const isClientSide = () => {
    return typeof window !== "undefined";
};

const countClickAds = () => {
    let clickAds = localStorage.getItem(Config.KEY_CLICK_ADS);
    let totalClick = 0;
    if (clickAds) {
        try {
            totalClick = parseInt(clickAds);
        } catch (error) {}
    }
    totalClick++;
    localStorage.setItem(Config.KEY_CLICK_ADS, totalClick + "");

    if (totalClick >= Config.MAX_CLICK_ADS_PER_USER) {
        window.location.reload();
    }
};
