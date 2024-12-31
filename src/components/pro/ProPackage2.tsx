import React, { useEffect, useState } from "react";
import { IAppInfo } from "../../models/AppInfo";
import "./ProPackage2.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import MyContainer from "../container/myContainer";
import V4CircleProgress from "../container/V4CircleProgress";
import CancelSubscriptionDialog from "./CancelSubscriptionDialog";
import { IPaymentInfo } from "../../models/payment/paymentInfos";

const ProPackage2 = ({
    appInfo,
    loading,
    prices,
    orderInfo,
    paymentInfo,
    handleClickGetPro,
}: {
    appInfo: IAppInfo;
    loading?: boolean;
    prices: any[];
    orderInfo: any;
    paymentInfo: IPaymentInfo;
    handleClickGetPro: (index: number) => void;
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [currentPlan, setCurrentPlan] = useState(-1);
    const [active, setActive] = useState(-1);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [importCancelDialog, setImportCancelDialog] = useState(false);
    useEffect(() => {
        if (orderInfo && orderInfo.status === "ACTIVE") {
            let _currentPlanIndex = prices.findIndex(
                (p) => p.planId === orderInfo.plan_id
            );
            if (_currentPlanIndex !== -1) {
                setCurrentPlan(_currentPlanIndex);
                setActive(_currentPlanIndex);
            } else {
                console.log("Cannot find current plan!");
            }
        }
    }, [orderInfo]);

    return (
        <div className="app-pro-package-2">
            <MyContainer className="pro-package">
                {prices.map((price, i) => (
                    <PriceItem
                        price={price}
                        key={i}
                        active={i === active}
                        handleActive={() => setActive(i)}
                        isMobile={isMobile}
                        currentPlan={currentPlan === i}
                        disable={i < currentPlan || loading}
                        loading={loading}
                        handleClickItem={(event) => {
                            if (event == "cancel") {
                                setImportCancelDialog(true);
                                setOpenCancelDialog(true);
                            } else if (
                                event == "upgrade" &&
                                !openCancelDialog
                            ) {
                                // xử lý trường hợp đứa nào táy máy inspect tắt popup cancel đi và bấm upgrade
                                handleClickGetPro(i);
                            }
                        }}
                    />
                ))}
            </MyContainer>
            {importCancelDialog && (
                <CancelSubscriptionDialog
                    appInfo={appInfo}
                    open={openCancelDialog}
                    orderInfo={orderInfo}
                    setIsActive={(value: boolean) => setActive(-1)}
                    setOpen={setOpenCancelDialog}
                    paymentInfo={paymentInfo}
                />
            )}
        </div>
    );
};
const PriceItem = ({
    price,
    active = false,
    handleActive,
    isMobile,
    currentPlan,
    disable,
    loading,
    handleClickItem,
}: {
    price: any;
    active: boolean;
    handleActive: any;
    isMobile: boolean;
    currentPlan: boolean;
    disable: boolean;
    loading: boolean;
    handleClickItem: (event: string) => void;
}) => {
    const {
        price: salePrice,
        initPrice,
        type,
        averagePrice,
        trialDay,
        savePrice,
    } = price;
    return (
        <div
            className={`price-item-2 ${active ? "active" : ""} ${
                disable ? "disable" : ""
            }`}
            onClick={() => {
                if (!disable && !active) handleActive();
            }}
        >
            {active && (
                <div className="icon-check">
                    <img
                        src="./images/passemall/new-pro/check-price.png"
                        alt="icon-check"
                    />
                </div>
            )}
            <div className={"popular-text " + (currentPlan ? "current" : "")}>
                {currentPlan ? "Your current plan" : savePrice?.text}
                {loading && <V4CircleProgress size={12} thickness={2} />}
            </div>
            <div className="price-item-container">
                <div className="price-section">
                    <span className="sale-price" id="text-save-price">
                        ${salePrice}{" "}
                    </span>
                    {initPrice && (
                        <span className="current-price">${initPrice}</span>
                    )}
                </div>
                <div className="type">{type}</div>
                <div className="divide"></div>
                <div className="average-price">
                    Just <b>${averagePrice} </b>
                    <span className="day">per Day</span>
                </div>
                <div className="trial-day">
                    {trialDay && (
                        <>
                            {trialDay} days <b>FREE</b> trial
                        </>
                    )}
                </div>
            </div>
            <div className="save-price">
                {!currentPlan ? (
                    <div
                        className="save-price-container"
                        onClick={() => {
                            if (!disable) {
                                handleClickItem("upgrade");
                            }
                        }}
                    >
                        <div className="save-percent">
                            Upgrade
                            {!!savePrice?.percent && (
                                <>
                                    To Save{" "}
                                    <span className="percent">
                                        {savePrice?.percent}
                                    </span>
                                    %{" "}
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className="cancel-subscription"
                        onClick={() => {
                            if (!disable) {
                                handleClickItem("cancel");
                            }
                        }}
                    >
                        Cancel Subscription
                    </div>
                )}
            </div>
        </div>
    );
};

/** orderInfo = {
    "status": "ACTIVE",
    "status_update_time": "2024-03-02T03:21:25Z",
    "id": "I-PTWWX8CVTV6S",
    "plan_id": "P-2SH95524CM0826016MQVLLUI",
    "start_time": "2024-03-02T03:20:42Z",
    "quantity": "1",
    "shipping_amount": {
        "currency_code": "USD",
        "value": "0.0"
    },
    "subscriber": {
        "email_address": "sb-43lc5f8692405@personal.example.com",
        "payer_id": "5493K3NU6RU2J",
        "name": {
            "given_name": "John",
            "surname": "Doe"
        },
        "shipping_address": {
            "name": {
                "full_name": "nga Doe"
            },
            "address": {
                "address_line_1": "1",
                "address_line_2": "2",
                "admin_area_2": "3",
                "postal_code": "1150",
                "country_code": "NZ"
            }
        }
    },
    "billing_info": {
        "outstanding_balance": {
            "currency_code": "USD",
            "value": "0.0"
        },
        "cycle_executions": [
            {
                "tenure_type": "TRIAL",
                "sequence": 1,
                "cycles_completed": 1,
                "cycles_remaining": 0,
                "current_pricing_scheme_version": 1,
                "total_cycles": 1
            },
            {
                "tenure_type": "REGULAR",
                "sequence": 2,
                "cycles_completed": 0,
                "cycles_remaining": 0,
                "current_pricing_scheme_version": 1,
                "total_cycles": 0
            }
        ],
        "next_billing_time": "2024-03-04T10:00:00Z",
        "failed_payments_count": 0
    },
    "create_time": "2024-03-02T03:21:25Z",
    "update_time": "2024-03-02T03:21:25Z",
    "plan_overridden": false,
    "statusCode": 200,
    "subscriptionInfo": "19.99/month"
} */

export default ProPackage2;
