import { useCallback } from "react";
import { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY } from "@/config/config_paypal";
import {
    saveToDashboardAPI,
    uploadPaymentInfoAPI,
} from "@/services/syncDataToWeb";
import { updateUserInfoDashboard } from "@/services/user";
import "./PayPalButtonView.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectUserInfo } from "@/redux/features/user.reselect";
import paymentSuccessThunk from "@/redux/repository/payment/paymentSuccess";
import {
    CreateOrderActions,
    FUNDING_SOURCE,
    OnApproveActions,
    OnApproveData,
} from "@paypal/paypal-js";
import { IPaymentInfos } from "@/models/payment/payment";

export type CreateOrderData = {
    paymentSource: FUNDING_SOURCE;
};
const initialOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: PAYPAL_CURRENCY,
    intent: "capture",
};
const PayPalBtn = ({
    paymentSuccess,
    price,
}: {
    paymentSuccess: () => void;
    price: number;
}) => {
    const appInfo = useAppSelector(selectAppInfo);
    const userInfo = useAppSelector(selectUserInfo);
    const dispatch = useAppDispatch();

    const onSavePayment = useCallback(
        async (payment: IPaymentInfos) => {
            try {
                const promises = [
                    uploadPaymentInfoAPI(payment),
                    updateUserInfoDashboard({
                        email: userInfo?.email,
                        appShortName: appInfo.appShortName,
                        appId: appInfo.appId + "",
                        isBuy: true,
                    }),
                    saveToDashboardAPI({
                        app: appInfo.appShortName,
                        price: price,
                        email: userInfo.email,
                    }),
                ];

                const responses = await Promise.all(promises);

                // *NOTE: check lai res

                const allSuccess = responses.every(
                    (response) => response && response.status === 200
                );
                if (allSuccess) {
                    dispatch(
                        paymentSuccessThunk({
                            data: payment,
                        })
                    );
                    paymentSuccess();
                }
            } catch (error) {}
        },
        [userInfo, appInfo, price, dispatch]
    );

    const handleCreateOrder = useCallback(
        (data: CreateOrderData, actions: CreateOrderActions) => {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            currency_code: PAYPAL_CURRENCY,
                            value: price.toString(),
                        },
                    },
                ],
                intent: "CAPTURE",
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
                await actions.order.capture().then((res) => {
                    if (res.status !== "COMPLETED") {
                        const payment: IPaymentInfos = {
                            appId: appInfo.appId,
                            userId: userInfo?.id,
                            createdDate: new Date(
                                res.create_time || ""
                            ).getTime(),
                            updateDate: new Date(
                                res.update_time || ""
                            ).getTime(),
                            emailAddress: userInfo.email,
                            amount: price,
                            orderId: res.id || "",
                            paymentStatus: 1,
                            appShortName: appInfo.appShortName,
                            payerName: res.payer?.name?.given_name || "",
                            payerId: res.payer?.payer_id || "",
                        };

                        onSavePayment(payment);
                    }
                });
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
                    createOrder={handleCreateOrder}
                    onApprove={onApproveOrder}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default PayPalBtn;
