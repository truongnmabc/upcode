import jwt from "jsonwebtoken";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import Config from "@/config";
import { APP_NEW_DOMAIN } from "@/config_app";
import {
    PAYPAL_STYLE,
    PAYPAL_SUBCRIPTION_CLIENT_ID,
    PAYPAL_SUBSCRIPTION_KEY,
    getConfigProV2,
} from "@/config/config_paypal";
import { isProduction } from "@/config/config_web";
import * as ga from "@/services/ga";
// import { IAppInfo } from "@/models/AppInfo";
import { PaymentInfo } from "@/models/payment/PaymentInfo";
// import {
//     saveToDashboardAPI,
//     uploadPaymentInfoAPI,
// } from "@/services/syncDataToWeb";
import {
    cancelSubscriptionAPI,
    checkPaypalStatusAPI,
    sendEmailSubscribeSuccessAPI,
} from "@/services/paypal.service";
import { updateUserInfoDashboard } from "@/services/user";
import "./SubcriptionButton.scss";
import { IButtonPropsV4 } from "../PopupGetPro";
import { setCookieDate } from "@/utils/web";
import { paymentSuccessAction, userState } from "@/redux/features/user";
import { IAppInfo } from "@/models/app/appInfo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const listEventName = [
    "basic_upgrade_success",
    "popular_upgrade_success",
    "economical_upgrade_success",
];
const SubcriptionButton = ({
    appConfig,
    paymentSuccess,
    valueButton,
    appInfo,
}: {
    appConfig: any;
    paymentSuccess: Function;
    valueButton?: IButtonPropsV4;
    appInfo: IAppInfo;
}) => {
    const dispatch = useAppDispatch();
    let { paymentInfo } = useAppSelector(userState);

    let PLAN_ID = "";
    let eventName = "";

    const { prices: newPrice } = getConfigProV2(appInfo);
    const eventIndex = newPrice?.findIndex(
        (price) => price.planId === valueButton.planId
    );
    eventName = listEventName[eventIndex];
    PLAN_ID = valueButton.planId;

    const onSavePayment = async (details) => {
        let index = valueButton.index;
        let ga_Action = "";
        if (index == 0) ga_Action = "success_basic_plan";
        else if (index == 1) ga_Action = "success_pop_plan";
        else if (index == 2) ga_Action = "success_eco_plan";
        ga.event({
            action: ga_Action,
            params: {
                appName: appInfo.appName,
            },
        });
        ga.event({
            action: "upgrade_success",
            params: {
                appName: appInfo.appName,
            },
        });

        const appId = appInfo.appId ?? APP_NEW_DOMAIN;
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
        const emailSubcription = details.subscriber?.email_address ?? "";
        let payerName = details.subscriber?.name?.given_name ?? "";
        let expiryDate = details.billing_info?.next_billing_time;
        console.log(
            "details.billing_info.next_billing_time",
            details.billing_info.next_billing_time
        );
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
        // APPROVAL_PENDING. The subscription is created but not yet approved by the buyer.
        // APPROVED. The buyer has approved the subscription.
        // ACTIVE. The subscription is active.
        // SUSPENDED. The subscription is suspended.
        // CANCELLED. The subscription is cancelled.
        // EXPIRED. The subscription is expired.
        // paymentInfo.id = details.id;
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
                ga.event({
                    action: "save_payment_error",
                    params: {
                        action_type: "ab_testing",
                        value_win: price,
                        email_address: paymentInfo.emailAddress,
                    },
                });
            }
            await updateUserInfoDashboard({
                email: userReducer?.userInfo?.email,
                appShortName: appInfo.appShortName,
                appId: appInfo.appId + "",
                isBuy: true,
            });
        } catch (error) {
            ga.event({
                action: "save_payment_error",
                params: {
                    action_type: "ab_testing",
                    value_win: price,
                    email_address: paymentInfo.emailAddress,
                    error: error,
                },
            });
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
        if (isProduction()) {
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

    return (
        <div className="main-paypal-button">
            <PayPalButton
                style={PAYPAL_STYLE}
                options={{
                    vault: true,
                    clientId: PAYPAL_SUBCRIPTION_CLIENT_ID,
                }}
                createSubscription={(data, actions) => {
                    ga.event({
                        action: "create_order_paypal",
                        params: {
                            price: 0,
                            type_payment: "subscription",
                            action_type: "click",
                        },
                    });
                    return actions.subscription.create({
                        plan_id: PLAN_ID,
                    });
                }}
                onApprove={async (data, actions) => {
                    try {
                        const details: any = await checkPaypalStatusAPI(
                            data.subscriptionID
                        );
                        let price =
                            details?.billing_info?.last_payment?.amount
                                ?.value ?? 0;
                        if (eventName) {
                            ga.event({
                                action: eventName,
                                params: {
                                    price: price,
                                    type_payment: "subscription",
                                    action_type: "click",
                                },
                            });
                        }
                        ga.event({
                            action: "create_order_paypal_success",
                            params: {
                                price: price,
                                type_payment: "subscription",
                                action_type: "click",
                            },
                        });
                        return onSavePayment(details);
                    } catch (error) {
                        // console.log("error", error);
                    }
                }}
                catchError={(err) => {
                    ga.event({
                        action: "subscription_catch_error",
                        params: {
                            error: err.message,
                        },
                    });
                }}
                onError={(err) => {
                    ga.event({
                        action: "subscription_catch_error",
                        params: {
                            error: err.message,
                        },
                    });
                }}
            />
        </div>
    );
};

export default SubcriptionButton;
