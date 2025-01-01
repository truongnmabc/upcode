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
import SubScriptionButton from "../paypalButton/subScriptionBtnPayment";
import { IPriceConfig } from "@/utils/config_paypal";
import { useRouter } from "next/navigation";
import { revertPathName } from "@/utils/pathName";
import RouterApp from "@/common/router/router.constant";

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
    const router = useRouter();
    const onPaymentSuccess = () => {
        const _href = revertPathName({
            appName: appInfo.appShortName,
            href: RouterApp.Billing,
        });
        router.push(_href);
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

                {appConfig?.subscription || isSubscription ? (
                    <SubScriptionButton
                        appConfig={appConfig}
                        paymentSuccess={onPaymentSuccess}
                        valueButton={valueButton}
                        appInfo={appInfo}
                    />
                ) : (
                    <PayPalBtn
                        price={valueButton.price}
                        paymentSuccess={onPaymentSuccess}
                    />
                )}
            </div>
        </Dialog>
    );
};

export default PopupGetProPayment;
