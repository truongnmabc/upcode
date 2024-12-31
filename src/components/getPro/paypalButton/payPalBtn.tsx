import { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import Config from "@/config";
import { PaymentInfo } from "@/models/payment/PaymentInfo";
import { updateUserInfoDashboard } from "@/services/user";
import "./PayPalButtonView.scss";
import {
    PAYPAL_CLIENT_ID,
    PAYPAL_CURRENCY,
    PAYPAL_STYLE,
} from "@/config/config_paypal";
import {
    saveToDashboardAPI,
    uploadPaymentInfoAPI,
} from "@/services/syncDataToWeb";
import { paymentSuccessAction, userState } from "@/redux/features/user";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    PayPalScriptProvider,
    PayPalButtons,
    CreateOrderBraintreeActions,
} from "@paypal/react-paypal-js";

import { appInfoState } from "@/redux/features/appInfo";
import {
    CreateOrderActions,
    FUNDING_SOURCE,
    OnApproveActions,
    OnApproveData,
} from "@paypal/paypal-js";
import { isProduction } from "@/common/constants";

export type CreateOrderData = {
    paymentSource: FUNDING_SOURCE;
};

const PayPalBtn = ({
    paymentSuccess,
    price,
    stateValue,
}: {
    paymentSuccess: Function;
    price: number;
    stateValue: string;
}) => {
    let { paymentInfo } = useAppSelector(userState);
    const { appInfo } = useAppSelector(appInfoState);
    const appId = appInfo.appId;
    const [paymentSource, setPaySource] = useState("");
    const dispatch = useAppDispatch();
    const onSavePayment = async (details) => {
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
        paymentInfo[stateValue] = Config.PURCHASED;
        dispatch(paymentSuccessAction(paymentInfo));
        let obj = {
            ...paymentInfo,
            appId,
            userId: userInfo?.id,
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
            }
        } catch (error) {}
        if (isProduction) {
            saveToDashboardAPI({
                app: appInfo.appShortName,
                price: price,
                email: details.payer.email_address,
            });
        }
        setTimeout(() => {
            paymentSuccess(true);
        }, 2500);
    };

    const initialOptions = {
        clientId: PAYPAL_CLIENT_ID,
        currency: PAYPAL_CURRENCY,
        intent: "capture",
    };

    const handleCreateOrder = (
        data: CreateOrderData,
        actions: CreateOrderActions
    ) => {
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
    };

    const onApproveOrder = (data: OnApproveData, actions: OnApproveActions) => {
        if (actions.order) {
            return actions.order.capture().then((details) => {
                if (details.payer?.name) {
                    const name = details.payer.name.given_name;
                    alert(`Transaction completed by ${name}`);
                }
            });
        }
    };

    return (
        <div className="main-paypal-button">
            {/* <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "pill",
                        tagline: false,
                        height: 50,
                        color: "white",
                        layout: "vertical",
                    }}
                    createOrder={handleCreateOrder}
                    onApprove={onApproveOrder}
                />
            </PayPalScriptProvider> */}

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
                    // trackABTestEvent(appInfo.appShortName, price, null);

                    onSavePayment(details);
                }}
            />
        </div>
    );
};

export default PayPalBtn;
