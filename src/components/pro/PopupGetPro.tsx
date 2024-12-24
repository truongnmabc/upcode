import Dialog from "@mui/material/Dialog";
import React from "react";
import {
    SUBSCRIPTION,
    getConfigAppPro,
    getConfigProV2,
} from "../../config/config_paypal";
// import SubcriptionButton from "./paypal_button/SubcriptionButton";
import "./PopupGetPro.scss";
import { IAppInfo } from "../../models/AppInfo";
import ProPlanSvg from "../icon/ProPlanSvg";
import PayPalButtonView from "./paypal_button/PayPalButtonView";

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
const PopupGetPro = ({
    onClose,
    valueButton,
    appInfo,
}: {
    onClose: () => void;
    valueButton: IButtonPropsV4;
    appInfo: IAppInfo;
}) => {
    return (
        <React.Fragment>
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
                <PopUpGetProContent
                    appInfo={appInfo}
                    valueButton={valueButton}
                    onClose={onClose}
                />
            </Dialog>
        </React.Fragment>
    );
};
const PopUpGetProContent = ({
    valueButton,
    appInfo,
    onClose,
}: {
    valueButton: IButtonPropsV4;
    appInfo: IAppInfo;
    onClose: () => void;
}) => {
    const appConfig = getConfigAppPro(appInfo);

    const onPaymentSuccess = () => {
        window.location.href = "/billing";
        onClose();
    };
    const isSubscription = getConfigProV2(appInfo).type === SUBSCRIPTION;
    return (
        <div className="popup-new-pro">
            {!appConfig?.subscription && (
                <div className="title-popup">
                    <ProPlanSvg />
                    <span className="pro-plan">PRO PLAN</span>
                </div>
            )}

            <div className="popup-text">
                <div className="title-popup pro-title">
                    {valueButton.mainTitlePopUp}
                </div>
                <div className="price">
                    Upgrade for <span>${valueButton.value.toString()}</span>
                </div>
            </div>
            {/* {appConfig?.subscription || isSubscription ? (
                <SubcriptionButton
                    appConfig={appConfig}
                    paymentSuccess={onPaymentSuccess}
                    valueButton={valueButton}
                    appInfo={appInfo}
                />
            ) : (
                <PayPalButtonView
                    price={valueButton.value}
                    stateValue={valueButton.stateValue}
                    paymentSuccess={onPaymentSuccess}
                />
            )} */}
        </div>
    );
};
export default PopupGetPro;
