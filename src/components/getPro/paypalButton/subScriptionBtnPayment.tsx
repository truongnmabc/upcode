import jwt from "jsonwebtoken";
import Config from "@/config";
import {
    PAYPAL_SUBSCRIPTION_CLIENT_ID,
    PAYPAL_SUBSCRIPTION_KEY,
    getConfigProV2,
} from "@/config/config_paypal";

import {
    saveToDashboardAPI,
    uploadPaymentInfoAPI,
} from "@/services/syncDataToWeb";
import {
    cancelSubscriptionAPI,
    checkPaypalStatusAPI,
    sendEmailSubscribeSuccessAPI,
} from "@/services/paypal.service";
import { updateUserInfoDashboard } from "@/services/user";
import "./SubcriptionButton.scss";
import { setCookieDate } from "@/utils/web";
import { IAppInfo } from "@/models/app/appInfo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IButtonPropsV4 } from "@/components/pro/PopupGetPro";
import { isProduction } from "@/common/constants";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

import {
    CreateSubscriptionActions,
    OnApproveActions,
    OnApproveData,
} from "@paypal/paypal-js";
import { useCallback } from "react";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { selectPaymentInfo } from "@/redux/features/payment.reselect";
import { IPriceConfig } from "@/utils/config_paypal";
import { IPaymentInfos } from "@/models/payment/payment";
const listEventName = [
    "basic_upgrade_success",
    "popular_upgrade_success",
    "economical_upgrade_success",
];

const initialOptions = {
    clientId: PAYPAL_SUBSCRIPTION_CLIENT_ID,
    intent: "subscription",
    vault: true,
};

// APPROVAL_PENDING. The subscription is created but not yet approved by the buyer.
// APPROVED. The buyer has approved the subscription.
// ACTIVE. The subscription is active.
// SUSPENDED. The subscription is suspended.
// CANCELLED. The subscription is cancelled.
// EXPIRED. The subscription is expired.
// paymentInfo.id = details.id;

const SubScriptionButton = ({
    appConfig,
    paymentSuccess,
    valueButton,
    appInfo,
}: {
    appConfig: any;
    paymentSuccess: Function;
    valueButton: IPriceConfig;
    appInfo: IAppInfo;
}) => {
    const dispatch = useAppDispatch();
    const paymentInfo = useAppSelector(selectPaymentInfo);
    const userInfo = useAppSelector(selectUserInfo);

    let PLAN_ID = valueButton.planId;
    let eventName = "";

    const { prices: newPrice } = getConfigProV2(appInfo);
    const eventIndex = newPrice?.findIndex(
        (price) => price.planId === valueButton.planId
    );
    eventName = listEventName[eventIndex];

    const onSavePayment = async (details: IPaymentInfos) => {
        const appId = appInfo.appId;
        let price = 0;
        try {
            // cancel subscription trước đó (trường hợp upgrade lên gói mới) (cancel trên paypal)
            if (details.billing_info.last_payment) {
                price = details.billing_info.last_payment?.amount?.value;
            } else {
                let item = details.billing_info.cycle_executions?.find(
                    (e) => e.tenure_type == "REGULAR"
                );
                if (item) {
                    price =
                        item?.total_price_per_cycle?.total_item_amount?.value;
                }
            }
            if (paymentInfo?.orderId) {
                cancelSubscriptionAPI(paymentInfo?.orderId);
            }
        } catch (error) {
            // console.log("error", error);
        }
        const emailSubScription = details.subscriber?.email_address ?? "";
        let payerName = details.subscriber?.name?.given_name ?? "";
        let expiryDate = details.billing_info?.next_billing_time;

        if (paymentInfo) {
            const currentOrderIds = paymentInfo.orderIds ?? [];
            paymentInfo = {
                ...paymentInfo,
                amount: price,
                orderIds: [...currentOrderIds, details.id],
                expiredDate: new Date(expiryDate).getTime(),
            };
        } else {
            paymentInfo = new PaymentInfo({
                createdDate: new Date(details.create_time).getTime(),
                amount: price,
                emailAddress: emailSubcription?.toLowerCase(),
                osVersion: "web",
                appId: appId,
                payerName,
                orderIds: [details.id],
                expiredDate: new Date(expiryDate).getTime(),
            });
        }

        paymentInfo.orderId = details.id;
        paymentInfo.type = Config.PAY_SUBSCRIPTION;
        paymentInfo.appShortName = appInfo.appShortName;
        paymentInfo.buyPro =
            details.status == "ACTIVE"
                ? Config.PAYMENT_SUCCESS
                : Config.PAYMENT_INIT;
        paymentInfo.userId = userReducer.userInfo?.id;
        let obj = {
            ...paymentInfo,
            appId,
        };
        try {
            let result = await uploadPaymentInfoAPI(obj);
            if (result != "ok") {
                // ga.event({
                //     action: "save_payment_error",
                //     params: {
                //         action_type: "ab_testing",
                //         value_win: price,
                //         email_address: paymentInfo.emailAddress,
                //     },
                // });
            }
            await updateUserInfoDashboard({
                email: userInfo?.email,
                appShortName: appInfo.appShortName,
                appId: appInfo.appId + "",
                isBuy: true,
            });
        } catch (error) {
            // ga.event({
            //     action: "save_payment_error",
            //     params: {
            //         action_type: "ab_testing",
            //         value_win: price,
            //         email_address: paymentInfo.emailAddress,
            //         error: error,
            //     },
            // });
        }
        dispatch(paymentSuccessAction(paymentInfo));
        try {
            if (details.status == "ACTIVE") {
                //?????
                let token = jwt.sign(
                    // dùng version 8.5.1
                    {
                        timeExpired: expiryDate,
                        appId: appId,
                    },
                    process.env.NEXT_PUBLIC_SECRET_KEY
                );
                setCookieDate(
                    PAYPAL_SUBSCRIPTION_KEY,
                    token,
                    new Date(expiryDate)
                );
            }
        } catch (error) {
            console.log("jwt error", error);
        }
        if (isProduction) {
            await saveToDashboardAPI({
                app: appInfo.appShortName,
                price: price,
                email: emailSubcription,
            });
            try {
                await sendEmailSubscribeSuccessAPI(
                    appInfo,
                    "$" + price.toString(),
                    emailSubcription,
                    new Date(expiryDate),
                    appConfig.questionNumber,
                    payerName
                );
            } catch (error) {
                console.log("error", error);
            }
        }
        setTimeout(() => {
            paymentSuccess(true);
        }, 500);
    };

    const handleCreateSubscription = useCallback(
        (data: Record<string, unknown>, actions: CreateSubscriptionActions) => {
            return actions.subscription.create({
                plan_id: PLAN_ID,
            });
        },
        []
    );

    const onApproveOrder = useCallback(
        async (
            data: OnApproveData,
            actions: OnApproveActions
        ): Promise<void> => {
            if (actions.order) {
                try {
                    if (data.subscriptionID) {
                        const details: any = await checkPaypalStatusAPI(
                            data.subscriptionID
                        );
                        const payment: IPaymentInfos = {
                            appId: appInfo.appId,
                            userId: userInfo?.id,
                            createdDate: new Date(
                                details.create_time || ""
                            ).getTime(),
                            updateDate: new Date(
                                details.update_time || ""
                            ).getTime(),
                            emailAddress: userInfo.email,
                            amount: details.price,
                            orderId: details.id || "",
                            paymentStatus: 1,
                            appShortName: appInfo.appShortName,
                            payerName: details.payer?.name?.given_name || "",
                            payerId: details.payer?.payer_id || "",
                        };

                        return onSavePayment(payment);
                    }
                } catch (error) {
                    console.log("🚀 ~ error:", error);
                }
            } else {
                return Promise.resolve();
            }
        },
        [onSavePayment]
    );

    return (
        <div className="main-paypal-button">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "pill",
                        tagline: false,
                        height: 50,
                        color: "white",
                        layout: "vertical",
                    }}
                    createSubscription={handleCreateSubscription}
                    onApprove={onApproveOrder}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default SubScriptionButton;
