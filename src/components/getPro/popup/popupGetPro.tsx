import Dialog from "@mui/material/Dialog";
import React from "react";
import {
    SUBSCRIPTION,
    getConfigAppPro,
    getConfigProV2,
} from "@/config/config_paypal";
import "./popupGetPro.scss";
import { IAppInfo } from "@/models/app/appInfo";
import ProPlanSvg from "@/components/icon/ProPlanSvg";
import PayPalBtn from "@/components/getPro/paypalButton/payPalBtn";
import SubcriptionButton from "../paypalButton/SubcriptionButton";
import { IPriceConfig } from "@/utils/config_paypal";

export interface IButtonPropsV4 {
    price: string;
    value: number;
    stateValue: string;
    buttonContent?: string;
    isPdf?: boolean;
    mainTitlePopUp: string;
    valueName?: string;
    planId?: string;
    index: number;
}
const PopupGetProPayment = ({
    onClose,
    valueButton,
    appInfo,
}: {
    onClose: () => void;
    valueButton: IPriceConfig;
    appInfo: IAppInfo;
}) => {
    const appConfig = getConfigAppPro(appInfo);

    const onPaymentSuccess = () => {
        window.location.href = "/billing";
        onClose();
    };
    const isSubscription = getConfigProV2(appInfo).type === SUBSCRIPTION;

    return (
        <Dialog
            className="pop-up-new-pro-pc"
            onClose={() => onClose()}
            open={true}
            PaperProps={{
                style: {
                    borderRadius: "20px",
                    maxHeight: "70vh",
                    width: "100%",
                },
            }}
        >
            <div className="popup-new-pro">
                {!appConfig?.subscription && (
                    <div className="title-popup">
                        <ProPlanSvg />
                        <span className="pro-plan">PRO PLAN</span>
                    </div>
                )}

                <div className="popup-text">
                    <div className="title-popup pro-title">
                        Unlock all Features
                    </div>
                    <div className="price">
                        Upgrade for <span>${valueButton.price.toString()}</span>
                    </div>
                </div>

                <PayPalBtn
                    price={valueButton.price}
                    // stateValue={valueButton.stateValue}
                    paymentSuccess={onPaymentSuccess}
                />
                {/* 
                {appConfig?.subscription || isSubscription ? (
                    <SubcriptionButton
                        appConfig={appConfig}
                        paymentSuccess={onPaymentSuccess}
                        valueButton={valueButton}
                        appInfo={appInfo}
                    />
                ) : (
                    <PayPalBtn
                        price={valueButton.value}
                        stateValue={valueButton.stateValue}
                        paymentSuccess={onPaymentSuccess}
                    />
                )} */}
            </div>
        </Dialog>
    );
};

export default PopupGetProPayment;
