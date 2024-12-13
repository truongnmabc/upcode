"use client";
import { useAppSelector } from "@/redux/hooks";
import "./index.css";
import { appInfoState } from "@/redux/features/appInfo";

const GetProPage = () => {
  const { appInfo } = useAppSelector(appInfoState);
  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <div className="pro-background">
          <h1>
            Pass for the first time <small>with</small>{" "}
            <span>
              {appInfo.appName}{" "}
              <span>
                Pro <img src="/images/passemall/new-pro/pro.png" />
              </span>
            </span>{" "}
            Plan
          </h1>

          <div className="app-feature">
            <p>
              <img src="/images/passemall/new-pro/Checkbox.png" />
              Unlock Detailed Explanations
            </p>
            <p>
              <img src="/images/passemall/new-pro/Checkbox.png" />
              Get {appInfo.totalQuestion}+ Questions On Mobile App
            </p>
            <p>
              <img src="/images/passemall/new-pro/Checkbox.png" />
              Remove All Disturbing Ads
            </p>
          </div>
          {/* <div className="logo-line">
            <StoreArchievement appInfo={appInfo} reverse />
          </div> */}
        </div>
        <div className="packages" id="app-pro-package">
          {/* <ProPackage
            // appInfo={appInfo}
            handleClickGetPro={handleClickGetPro}
            loading={loading}
            prices={prices}
          /> */}
        </div>
        <p className="pro-description">
          Subscriptions auto-renew at the cost of the chosen package, unless
          cancelled 24 hours in advance of the end of the current period. The
          subscription fee is charged to your PayPal account upon purchase. You
          may manage your subscription and turn off auto-renewal by accessing
          your Account Settings after purchase. Per our policy, you cannot
          cancel your current subscription during the active subscription
          period. No refunds will be provided for any unused portion of the
          subscription term.
        </p>
      </div>
    </>
  );
};

export default GetProPage;
