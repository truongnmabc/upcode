"use client";

import Config from "@/config";

import { useEffect, useState } from "react";
import PopupGetPro, { IButtonPropsV4 } from "../../components/pro/PopupGetPro";
import ProPackage from "../../components/pro/ProPackage";
import MyContainer from "../../components/container/myContainer";
import {
    ONETIME,
    SUBSCRIPTION,
    getConfigProV2,
} from "../../config/config_paypal";
import { isSubscriptionId } from "../../models/payment/paymentInfos";
import * as ga from "@/services/ga";
import "./index.scss";
import V4LoginDialog from "@/components/header/V4LoginDialog";
import { IAppInfo } from "@/models/app/appInfo";
import { getListTransactionAPI } from "@/services/paypal.service";
import { useAppSelector } from "@/redux/hooks";
import { userState } from "@/redux/features/user";
import StoreArchievement from "./StoreArchievement";
import StoreReviews from "./store-review/StoreReviews";

const GetProPage = ({ appInfo }: { appInfo: IAppInfo }) => {
    const userReducer = useAppSelector(userState);
    const paymentInfo = userReducer.paymentInfo;
    const userInfo = userReducer.userInfo;
    const [loading, setLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useState<any>(null);
    const { prices, type } = getConfigProV2(appInfo);
    const [valueButton, setValueButton] = useState<IButtonPropsV4 | null>(null);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);

    useEffect(() => {
        const getBilling = async () => {
            setLoading(true);
            let { orderInfo } = await getListTransactionAPI(
                paymentInfo.orderId,
                paymentInfo?.orderIds?.filter((id) => id) ?? []
            );
            setOrderInfo(orderInfo);
            setLoading(false);
        };
        if (
            paymentInfo?.orderId &&
            isSubscriptionId(paymentInfo?.orderId) &&
            type === SUBSCRIPTION
        ) {
            getBilling();
        }
    }, [paymentInfo?.orderId]);

    const handleClickGetPro = (index: number) => {
        // đã gọi vào đây tức là gói được chọn là có thể mua
        let ga_Action = "";
        if (index == 0) ga_Action = "select_basic_plan";
        else if (index == 1) ga_Action = "select_pop_plan";
        else if (index == 2) ga_Action = "select_eco_plan";
        ga.event({
            action: ga_Action,
            params: {
                appName: appInfo.appName,
            },
        });
        ga.event({
            action: "click_upgrade",
            params: {
                appName: appInfo.appName,
            },
        });

        let stateValue = "buyPro"; //dataConfig.config[dataConfig.config.length - 1].bottomContent.stateValue;

        if (!userInfo) {
            // localStorage.setItem(
            //     Config.POPUP_VALUE_LOCAL_STORAGE,
            //     JSON.stringify({
            //         price: currentPrice + "",
            //         value: currentPrice,
            //         mainTitlePopUp: "Unlock all Features",
            //         isPdf: false,
            //         stateValue: stateValue,
            //         planId,
            //     })
            // );
            // xử lý chuyển sang trang login
            setOpenLoginDialog(true);
            return;
        }

        if (type === ONETIME) {
            if (paymentInfo?.buyPro === Config.PURCHASED) {
                window.location.href = "/billing";
                return;
            }
        } else {
            let orderIndex = prices.findIndex(
                (p) => p.planId === orderInfo?.plan_id
            );
            if (orderIndex > -1 && index <= orderIndex) {
                // nếu đã từng mua rồi thì chuyển sang trang billing
                window.location.href = "/billing";
                return;
            }
        }
        let planId = "";
        const configNewPro = prices[index];
        let price = configNewPro?.price;
        planId = configNewPro?.planId;
        let currentPrice = 0;
        currentPrice = price;
        setValueButton({
            price: currentPrice + "",
            value: currentPrice,
            stateValue: stateValue,
            isPdf: false,
            mainTitlePopUp: "Unlock all Features",
            planId,
            index,
        });
    };

    return (
        <>
            {valueButton && !!userInfo && (
                <PopupGetPro
                    appInfo={appInfo}
                    onClose={() => {
                        setValueButton(null);
                    }}
                    valueButton={valueButton}
                />
            )}

            <div style={{ overflow: "hidden" }}>
                <div className="pro-background">
                    <MyContainer>
                        <h1>
                            Pass for the first time <small>with</small>{" "}
                            <span>
                                {appInfo.appName}{" "}
                                <span>
                                    Pro{" "}
                                    <img src="/images/passemall/new-pro/pro.png" />
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
                                Get {appInfo.totalQuestion}+ Questions On Mobile
                                App
                            </p>
                            <p>
                                <img src="/images/passemall/new-pro/Checkbox.png" />
                                Remove All Disturbing Ads
                            </p>
                        </div>
                    </MyContainer>
                    <div className="logo-line">
                        <StoreArchievement appInfo={appInfo} reverse />
                    </div>
                </div>
                <div className="packages" id="app-pro-package">
                    {/* <ProPackage
                        // appInfo={appInfo}
                        handleClickGetPro={handleClickGetPro}
                        loading={loading}
                        prices={prices}
                    /> */}
                </div>
                <MyContainer className="pro-content">
                    <p className="pro-description">
                        Subscriptions auto-renew at the cost of the chosen
                        package, unless cancelled 24 hours in advance of the end
                        of the current period. The subscription fee is charged
                        to your PayPal account upon purchase. You may manage
                        your subscription and turn off auto-renewal by accessing
                        your Account Settings after purchase. Per our policy,
                        you cannot cancel your current subscription during the
                        active subscription period. No refunds will be provided
                        for any unused portion of the subscription term.
                    </p>
                    <StoreReviews appId={appInfo.appId} />
                </MyContainer>
            </div>
            <V4LoginDialog
                appInfo={appInfo}
                open={openLoginDialog}
                setOpen={setOpenLoginDialog}
            />
        </>
    );
};

export default GetProPage;
