import Config from "@/config";
import { IAppInfo } from "@/models/AppInfo";
import {
    IPaymentInfo,
    InAppSubscription,
    PaymentInfo,
    isSubscriptionId,
} from "@/models/PaymentInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { syncDataToWebAfterLoginAPI } from "@/services/user";

/** lấy dữ liệu payment (web), inAppSubscription (mobile) và update vào redux, gọi mỗi khi vào trang */
const getUserDeviceLogin = createAsyncThunk(
    "getUserDeviceLogin",
    async (appInfo: IAppInfo, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { userInfo, paymentInfos } = state.userReducer;
        if (!!userInfo) {
            try {
                let syncData = await syncDataToWebAfterLoginAPI({
                    email: userInfo?.id,
                    appId: appInfo.appId,
                    lastUpdate: -1,
                });

                let userDeviceLogin = syncData.UserDeviceLogins.filter(
                    (u) => u
                );
                let inAppSubscriptions = syncData.InAppSubscriptions; // mua trên mobile
                let inAppSubs: InAppSubscription[] = [];

                if (inAppSubscriptions?.length) {
                    const nd = (d: string) => parseInt(d);

                    inAppSubs = inAppSubscriptions.map((app) => {
                        let result = JSON.parse(app?.result ?? "");
                        let in_app = [];

                        result.receipt.in_app.forEach((item) => {
                            in_app.push({
                                purchase_date: nd(item.purchase_date_ms),
                                expires_date: nd(item.expires_date_ms),
                                in_app_ownership_type:
                                    item.in_app_ownership_type,
                                is_trial_period: item.is_trial_period,
                            });
                        });

                        result.latest_receipt_info?.forEach((item) => {
                            in_app.push({
                                purchase_date: nd(item.purchase_date_ms),
                                expires_date: nd(item.expires_date_ms),
                                in_app_ownership_type:
                                    item.in_app_ownership_type,
                                is_trial_period: item.is_trial_period,
                            });
                        });

                        return {
                            id: app.id,
                            appId: app.appId,
                            userId: app.userId,
                            os: app.os,
                            transactionId: app.transactionId,
                            createDate: app.createDate,
                            purchaseDate: app.purchaseDate,
                            expriredDate: app.expriredDate,
                            purchased: app.purchased,
                            trialPeriod: app.trialPeriod,
                            in_app,
                        };
                    });
                }

                let { paymentInfo, paymentInfos } = handleUserDevicesLogin(
                    userDeviceLogin,
                    appInfo,
                    paymenyInfos
                );

                return { paymentInfo, paymentInfos, inAppSubs };
            } catch (error) {
                console.log("getUserData ", error);
            }
        }
        return null;
    }
);

/**
 * Hàm này xử lý data UserDevicesLogin lấy từ gg cloud về và lưu vào paymentInfo
 */
const handleUserDevicesLogin = (
    userDeviceLogins: any,
    appInfo: IAppInfo,
    paymentInfos: IPaymentInfo[]
) => {
    userDeviceLogins = userDeviceLogins.filter(
        (t) => t != null && t != undefined
    );
    try {
        let paymentInfosSave: PaymentInfo[] = [];
        let paymentInfo: PaymentInfo | null = null;
        for (const userDeviceLogin of userDeviceLogins) {
            if (!userDeviceLogin) {
                continue;
            }
            let paymentInfoExist = paymentInfos.find(
                (_paymentInfo) => _paymentInfo.appId == userDeviceLogin.appId
            );
            if (!paymentInfoExist) {
                // chưa tồn tại trong paymentInfos thì tạo mới
                paymentInfoExist = new PaymentInfo({
                    id: userDeviceLogin.id,
                    createdDate: userDeviceLogin.createdDate,
                    amount: userDeviceLogin.amount,
                    emailAddress: userDeviceLogin.emailAddress,
                    userId: userDeviceLogin.userId,
                    appId: userDeviceLogin.appId,
                    paymentStatus:
                        userDeviceLogin.inAppPURCHASED == 1
                            ? Config.PAYMENT_SUCCESS
                            : Config.PAYMENT_INIT,
                    appShortName: userDeviceLogin.appShortName,
                    expiredDate: userDeviceLogin?.expiredDate ?? -1,
                    PURCHASED:
                        userDeviceLogin.inAppPURCHASED == 1
                            ? Config.PURCHASED
                            : Config.PURCHASE,
                });
            } else {
                // tồn tại trong paymentInfos rồi thì update
                paymentInfoExist = new PaymentInfo({
                    ...paymentInfoExist,
                });
                if (userDeviceLogin.amount > 0) {
                    paymentInfoExist.amount = userDeviceLogin.amount;
                }
                if (userDeviceLogin.inAppPURCHASED == 1) {
                    paymentInfoExist.PURCHASED = userDeviceLogin.inAppPURCHASED;
                }
            }
            paymentInfoExist.orderId = userDeviceLogin.orderId;
            paymentInfoExist.type = userDeviceLogin.type ?? 0;
            paymentInfoExist.orderIds = userDeviceLogin?.orderIds ?? []; // ghi đè trường này, vậy tsao lại rỗng ???
            paymentInfoExist.expiredDate = userDeviceLogin?.expiredDate ?? -1;

            if (
                userDeviceLogin.buyPro == Config.PURCHASED ||
                userDeviceLogin.inAppPURCHASED == Config.PURCHASED
            ) {
                paymentInfoExist.buyPro = Config.PURCHASED;
                paymentInfoExist.PURCHASED = Config.PURCHASED;
            }

            if (isSubscriptionId(paymentInfoExist.orderId)) {
                localStorage.setItem(
                    "isSubcriptionPro",
                    Config.PAYMENT_PAY_SUBSCRIPTION
                );
            }
            if (paymentInfoExist.appId == appInfo.appId) {
                paymentInfo = paymentInfoExist;
            }
            paymentInfosSave.push(paymentInfoExist);
        }

        return { paymentInfos: paymentInfosSave, paymentInfo };
    } catch (error) {
        console.log("userDeviceLoginFC error ", error);
        return { paymentInfos: [], paymentInfo: null };
    }
};

export { getUserDeviceLogin };
