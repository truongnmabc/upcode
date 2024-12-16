import { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import Config from "../../../config";
import { APP_NEW_DOMAIN, APP_SHORT_NAME } from "../../../config_app";
import { PaymentInfo } from "../../../models/PaymentInfo";
import * as ga from "../../../services/ga";
import { updateUserInfoDashboard } from "../../../services/user";
import "./PayPalButtonView.scss";
import { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY, PAYPAL_STYLE } from "@/config/config_paypal";
import { isProduction } from "@/config/config_web";
import AppState from "@/redux/appState";
import { saveToDashboardAPI, uploadPaymentInfoAPI } from "@/services/syncDataToWeb";
import { paymentSuccessAction } from "@/redux/features/user";

const PayPalButtonView = ({
    paymentSuccess,
    price,
    stateValue,
}: {
    paymentSuccess: Function;
    price: number;
    stateValue: string;
}) => {
    let userReducer = useSelector((state: AppState) => state.userReducer);
    let appInfo = useSelector((state: AppState) => state.appInfoReducer.appInfo);
    const appId = appInfo.appId ?? APP_NEW_DOMAIN;
    const [paymentSource, setPaySource] = useState("");
    const dispatch = useDispatch();
    const onSavePayment = async (details) => {
        let paymentInfo = userReducer.paymentInfo;
        if (paymentInfo) {
            paymentInfo = {
                ...paymentInfo,
                timeLeftDiscount: stateValue === "buyPro" ? -2 : -1,
                amount: paymentInfo.amount + price,
            };
        } else {
            paymentInfo = new PaymentInfo({
                createdDate: new Date(details.create_time).getTime(),
                amount: price,
                emailAddress: details.payer.email_address,
                id: details.id,
                orderId: details.id,
                osVersion: "web",
                appId,
                appShortName: appInfo.appShortName,
                timeLeftDiscount: stateValue === "buyPro" ? -2 : -1,
            });
        }
        paymentInfo.paymentSource = paymentSource;
        paymentInfo.appId = appId;

        paymentInfo[stateValue] = Config.PURCHARED;

        dispatch(paymentSuccessAction(paymentInfo));
        let obj = {
            ...paymentInfo,
            appId,
            userId: userReducer.userInfo?.id,
        };
        try {
            let result = await uploadPaymentInfoAPI(obj);
            await updateUserInfoDashboard({
                email: userReducer?.userInfo?.email,
                appShortName: appInfo.appShortName,
                appId: appInfo.appId + "",
                isBuy: true,
            });
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
        if (isProduction()) {
            saveToDashboardAPI({
                app: APP_SHORT_NAME,
                price: price,
                email: details.payer.email_address,
            });
        }
        setTimeout(() => {
            paymentSuccess(true);
        }, 2500);
    };
    return (
        <div className="main-paypal-button">
            <PayPalButton
                amount={price}
                style={PAYPAL_STYLE}
                options={{
                    clientId: PAYPAL_CLIENT_ID,
                }}
                createOrder={(data, actions) => {
                    // tạo ra một đơn thanh toán với giá là price
                    setPaySource(data?.paymentSource ?? "");
                    let eventName = localStorage.getItem("event-name");
                    eventName = eventName ?? "buy_pro_" + price;

                    ga.event({
                        action: "create_order_paypal",
                        params: {
                            price: price,
                            type_payment: "one_time",
                            action_type: "click",
                        },
                    });
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: PAYPAL_CURRENCY,
                                    value: price,
                                },
                            },
                        ],
                    });
                }}
                onSuccess={(details, data) => {
                    ga.event({
                        action: "create_order_paypal_success",
                        params: {
                            price: price,
                            type_payment: "one_time",
                            action_type: "click",
                        },
                    });
                    // trackABTestEvent(appInfo.appShortName, price, null);

                    onSavePayment(details);
                }}
            />
        </div>
    );
};

export default PayPalButtonView;
