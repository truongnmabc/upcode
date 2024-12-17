import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Config from "../../../config";
import * as ga from "../../../services/ga";
import { IAppInfo } from "../../../models/AppInfo";
import {
    IPaymentInfo,
    isSubscriptionId,
} from "../../../models/payment/PaymentInfo";
import { checkPaypalStatusAPI } from "../../../services/paypal.service";
import "./PopupSubscription.scss";
import dynamic from "next/dynamic";
import { PAYPAL_SUBSCRIPTION_KEY } from "@/config/config_paypal";
import AppState from "@/redux/appState";
import {
    convertMillisecondsToDateZTime,
    getCookie,
    setCookieDate,
} from "@/utils/web";
import { uploadPaymentInfoAPI } from "@/services/syncDataToWeb";
import { paymentSuccessAction } from "@/redux/features/user";

const Dialog = dynamic(() => import("@mui/material/Dialog"), { ssr: false });

/**  component này để check xem còn pro hay không và nhắc nhở user, cancel, update lên datastore */
const PopupSubscription = ({ appInfo }: { appInfo: IAppInfo }) => {
    const dispatch = useDispatch();
    const paymentInfo: IPaymentInfo = useSelector(
        (state: AppState) => state.userReducer.paymentInfo
    ); // theo luồng hiện tại là giá trị của cái này được update nhờ action getUserDevicesLogin gọi ở LayoutV4
    const [option, setOption] = useState({
        showPopup: false,
        message: "",
        cancelled: false,
    });

    const handleSetCookieToken = async (next_billing_time: string) => {
        let token = await jwt.sign(
            {
                timeExpired: next_billing_time,
                appId: appInfo.appId,
            },
            process.env.NEXT_PUBLIC_SECRET_KEY
        );
        setCookieDate(
            PAYPAL_SUBSCRIPTION_KEY,
            token,
            new Date(next_billing_time)
        );
        if (new Date(next_billing_time).getTime() !== paymentInfo.expiredDate) {
            // chỗ này chỉ update lại expiredDate nên nếu khác nhau thì mới làm
            let object = {
                ...paymentInfo,
                forceUpdate: true,
                expiredDate: new Date(next_billing_time).getTime(),
            };
            await uploadPaymentInfoAPI(object);
            dispatch(paymentSuccessAction(object));
        }
    };

    useEffect(() => {
        // paymentInfo được tự động lấy khi vào trang trong LayoutV4 (quan trọng trường orderId và expireDate) về client thì check paypalStatus của orderId xong update ngược trở lại datastore (nếu cần)
        async function checkPaymentInfoFC() {
            // đm tự động update như này mà dữ liệu không được check kỹ là sai lòi
            let cookieValue = getCookie(PAYPAL_SUBSCRIPTION_KEY);
            let decodedToken = null;
            if (cookieValue) {
                try {
                    decodedToken = jwt.verify(
                        cookieValue,
                        process.env.NEXT_PUBLIC_SECRET_KEY
                    );
                } catch (error) {
                    console.log("error", error);
                }
            }

            // ** đoạn này sẽ ghi đè paymentInfo trên datastore (chú ý có thể có vđề về logic)
            if (
                paymentInfo &&
                isSubscriptionId(paymentInfo.orderId) &&
                paymentInfo.buyPro == Config.PURCHASED &&
                paymentInfo.orderId?.length &&
                (!decodedToken || // chú ý đoạn này timeExpired được set khi mua hàng thành công (lấy trường next_billing_time của paypal trả về)
                    // mà khoảng cách thời gian của trường đó với thời gian bắt đầu có hiệu lực không phải là 3 ngày (theo free Trial), nên chỗ này cần chú ý
                    new Date(decodedToken?.timeExpired).getTime() <
                        Date.now() ||
                    appInfo.appId != decodedToken.appId)
            ) {
                // nếu hết hạn hoặc chưa có trong cookie thì mới đi vào đây
                let data: any = await checkPaypalStatusAPI(paymentInfo.orderId); // lấy thông tin hiện tại của orderId này
                if (data?.status) {
                    // APPROVAL_PENDING. The subscription is created but not yet approved by the buyer.
                    // APPROVED. The buyer has approved the subscription.
                    // ACTIVE. The subscription is active.
                    // SUSPENDED. The subscription is suspended.
                    // CANCELLED. The subscription is cancelled.
                    // EXPIRED. The subscription is expired.
                    let messagStr = "";

                    switch (data.status) {
                        case "APPROVAL_PENDING":
                            // user need approved
                            messagStr =
                                "Please approve your subscription on Paypal to start using our Pro version";
                            break;
                        case "APPROVED":
                            // waiting admin approved
                            messagStr = "Admin approved";
                            break;
                        case "CANCELLED":
                        case "SUSPENDED":
                            if (handleCheckTimeExpired(paymentInfo) == true) {
                                messagStr =
                                    "Your subscription is cancelled. Please re-activate it to use our Pro version";
                            } else {
                                handleSetCookieToken(
                                    convertMillisecondsToDateZTime(
                                        paymentInfo.expiredDate
                                    )
                                );
                            }
                            //cancelled subscription
                            //cho ve ban thuong
                            break;
                        case "EXPIRED":
                            //user need renew
                            if (handleCheckTimeExpired(paymentInfo) == true) {
                                messagStr =
                                    "Your subscription is expired. Please re-activate it to use our Pro version";
                            } else {
                                handleSetCookieToken(
                                    convertMillisecondsToDateZTime(
                                        paymentInfo.expiredDate
                                    )
                                );
                            }
                            break;
                        case "ACTIVE":
                            let next_billing_time: string =
                                data.billing_info?.next_billing_time;
                            if (next_billing_time) {
                                handleSetCookieToken(next_billing_time);
                            }
                    }
                    if (messagStr?.length) {
                        setOption({
                            ...option,
                            showPopup: true,
                            message: messagStr,
                        });
                    }
                }
            }
        }
        if (!!paymentInfo) checkPaymentInfoFC(); // sau khi load xong paymentInfo thì mới gọi => paymentInfo lúc này là dữ liệu mới từ datastore, không phải từ persist
    }, [paymentInfo]);

    const cancelledSubscription = async () => {
        let object = {
            ...paymentInfo,
            forceUpdate: true,
            type: 0,
            buyPro: 0,
            PURCHASED: 0,
        };
        // chỉ cancel theo cách là update lại datastore thôi
        await uploadPaymentInfoAPI(object);
        dispatch(paymentSuccessAction(paymentInfo));
        ga.event({ action: "cancel_subscription", params: {} });
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    return (
        !!option?.showPopup && (
            <Dialog
                open={option.showPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="main-popup-subscription">
                    <p className="title">{option.message}</p>
                    <div className="btn">
                        <button
                            className="pay_late"
                            onClick={cancelledSubscription}
                        >
                            Back to Free Version
                        </button>
                        <button
                            className="btn_paypal"
                            onClick={() => {
                                window.open("https://paypal.com/", "_blank");
                            }}
                        >
                            Go to Paypal
                        </button>
                    </div>
                </div>
            </Dialog>
        )
    );
};

const handleCheckTimeExpired = (paymentInfo: IPaymentInfo) => {
    if (paymentInfo?.expiredDate) {
        let dateExpired = new Date(paymentInfo?.expiredDate).getTime();
        if (new Date().getTime() > dateExpired) {
            return true;
        } else {
            return false;
        }
    }
    return true;
};

export default PopupSubscription;
