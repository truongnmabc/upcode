import { IAppInfo } from "./../models/AppInfo";
import { callApi } from "../services";
import { getContactLink } from "../utils";
import Config from "../config";
import { isProduction } from "@/config/config_web";
import { genLinkPro } from "./home.service";
import { genStudyLink } from "@/utils/getStudyLink";

/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_get
 * lấy thông tin của đơn hàng hiện tại
 */
export const checkPaypalStatusAPI = async (orderId: string) => {
    let data = await callApi({
        url: "api/auth?type=check-status-subcription&orderId=" + orderId + (!isProduction() ? "&dev=true" : ""),
        params: null,
        method: "get",
    });
    return data;
};
/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#plans_get
 * lấy thông tin của gói (quan tâm đến thời gian hiệu lực của nó)
 */
export const getPlanInfoApi = async (planId: string) => {
    let data = await callApi({
        url: "api/auth?type=get-plan-info&planId=" + planId + (!isProduction() ? "&dev=true" : ""),
        params: null,
        baseURl: "https://dev-dot-micro-enigma-235001.appspot.com",
        method: "get",
    });
    return data;
};
/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_transactions
 * thông tin các lần thanh toán gia hạn ???
 */
export const getTransactionsSubscriptionApi = async (orderId: string) => {
    let data: any = await callApi({
        url: "api/auth?type=get-transactions-subscription&orderId=" + orderId + (isProduction() ? "" : "&dev=true"),
        method: "get",
        params: null,
    });
    return data;
};
export const getListTransactionAPI = async (orderId: string, orderIds: string[]) => {
    // vào trang thì lấy userDeviceLogin (trong LayoutV4) về (để lấy orderId) rồi ở đây check paypal status của orderId đó xong update ngược trở lên datastore
    try {
        let mapPlan_BillingCycle = {};
        let mapOrderId_status = {};
        let orderInfo: any = await checkPaypalStatusAPI(orderId);
        mapOrderId_status[orderId] = orderInfo;
        const NOT_FOUND_STATUS = 404;
        if (orderInfo.statusCode === NOT_FOUND_STATUS) {
            throw new Error("Not found!!!");
        }
        let planId = orderInfo?.plan_id;
        let planInfo: any = await getPlanInfoApi(planId);
        let billingCycles: any[] = planInfo.billing_cycles;
        mapPlan_BillingCycle[planId] = billingCycles;

        // có 2 loại là trial (của mình tặng 3 ngày dùng thử cho gói 1 tháng và 1 năm) và REGULAR (dùng thật),
        // khi dùng thử thì chưa trừ tiền
        let regularDate = 0; // dùng thật (dành cho orderId hiện tại)
        let trialDate = 0; // dùng thử (dành cho orderId hiện tại)
        let billingCycleSubInfo = billingCycles.find((el) => el.tenure_type == "REGULAR");
        let frequency = billingCycleSubInfo?.frequency;
        let frequencyName = "";
        if (frequency && frequency?.interval_unit == "DAY" && frequency?.interval_count === "7") {
            frequencyName = "week";
        } else {
            frequencyName = "month";
        }
        let subscriptionInfo = billingCycleSubInfo?.pricing_scheme?.fixed_price?.value + "/" + frequencyName;
        billingCycles.forEach((el) => {
            if (el?.tenure_type == "REGULAR") {
                regularDate += el?.frequency?.interval_count * Config.DATE_VALUE_STRING[el?.frequency?.interval_unit];
            }
            if (el?.tenure_type === "TRIAL") {
                trialDate += el?.frequency?.interval_count * Config.DATE_VALUE_STRING[el?.frequency?.interval_unit];
            }
        });
        let listTransaction: any[] = [];
        if (trialDate > 0) {
            // thời gian trial
            let timeSecondsTrial = new Date(orderInfo.create_time).getTime() + trialDate * Config.MILLISECONDS_PER_DAY;
            listTransaction.push({
                time: new Date(orderInfo.create_time).getTime(),
                amount: "0.00",
                expiryDate: new Date(timeSecondsTrial - Math.abs(new Date().getTimezoneOffset()) * 60 * 1000).getTime(), // convert theo đúng timezone
                status: "Trial",
                planId,
                orderId,
            });
        }

        if (orderIds.length > 0) {
            for (let id of orderIds) {
                if (!mapOrderId_status[id]) mapOrderId_status[id] = await checkPaypalStatusAPI(id);
            }

            const allTransactionStatus: any[] = await Promise.allSettled(
                orderIds.map((id) => {
                    return getTransactionsSubscriptionApi(id);
                })
            );

            let result = []; /// ? biến này để làm gì
            const THREE_DAYS = 3 * 1000 * 60 * 60 * 24;

            for (let index = 0; index < orderIds.length; index++) {
                let _orderId = orderIds[index];
                const transactionStatus = allTransactionStatus[index]?.value;
                const paypalStatus = mapOrderId_status[_orderId]; //allPaypalStatus[index]?.value;
                let planId = paypalStatus?.plan_id ?? "";
                let transactions = [];
                if (transactionStatus?.transactions) {
                    // nếu đã từng thanh toán, cần phải xác định luôn expireDate ở đây luôn

                    if (!mapPlan_BillingCycle[planId]) {
                        let planInfo: any = await getPlanInfoApi(planId); // lấy plan data của đơn hàng này
                        mapPlan_BillingCycle[planId] = planInfo.billing_cycles;
                    }
                    let billingCycles = mapPlan_BillingCycle[planId];
                    let plan = billingCycles.find((c) => c?.tenure_type == "REGULAR");
                    let cycle = plan?.frequency?.interval_count * Config.DATE_VALUE_STRING[plan?.frequency?.interval_unit]; // thời gian hiệu lực cho 1 lần ra hạn (đơn vị: ngày)
                    let next_billing_time = new Date(paypalStatus?.update_time).getTime();

                    // cần push trường hợp trial (nếu có) vào luôn
                    if (paypalStatus?.billing_info?.cycle_executions?.find((cycle) => cycle.tenure_type === "TRIAL")) {
                        next_billing_time += THREE_DAYS;
                        transactions.push({
                            time: paypalStatus?.create_time,
                            planId,
                            nextBillingTime: next_billing_time,
                            orderId: _orderId,
                        });
                    }

                    // push các lần ra hạn (dựa vào cycle để thêm next_billing_time)
                    transactions.push(
                        ...transactionStatus?.transactions // dữ liệu transactions sẽ là liên tiếp theo cycle, nếu không orderId sẽ bị cancel luôn
                            ?.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()) // sort theo thứ tự tăng dần
                            ?.map((t) => {
                                next_billing_time += cycle * Config.MILLISECONDS_PER_DAY;
                                return {
                                    ...t,
                                    planId,
                                    nextBillingTime: next_billing_time,
                                    orderId: _orderId,
                                };
                            })
                    );

                    if (paypalStatus.status === "CANCELLED") {
                        // nếu huỷ thì hiện thêm 1 dòng nó huỷ từ thời gian nào
                        // huỷ ở đây mặc định là ứng với transaction cuối củng
                        transactions.push({
                            time: paypalStatus?.update_time,
                            planId,
                            nextBillingTime: next_billing_time,
                            orderId: _orderId,
                        });
                    }
                } else if (paypalStatus?.id) {
                    // nếu chưa từng thanh toán thì check subscription (đang trial)
                    // trong thời gian trial thì paypal chưa trừ tiền
                    const value = paypalStatus;
                    let next_billing_time: any = "";
                    let expiryDate = value?.billing_info?.next_billing_time;
                    if (expiryDate) {
                        next_billing_time = new Date(expiryDate);
                    }

                    let missingNextBillingTime = value.status === "CANCELLED"; // trường hợp cancel thì sẽ k có billing_info.next_billing_time
                    if (
                        value?.billing_info?.cycle_executions?.find((cycle) => cycle.tenure_type === "TRIAL") &&
                        missingNextBillingTime
                    ) {
                        // trường hợp vừa mua nhưng huỷ luôn thì vẫn tính trial cho nó
                        if (new Date(value?.update_time).getTime() - new Date(value?.create_time).getTime() < THREE_DAYS) {
                            next_billing_time = new Date(value?.update_time).getTime() + THREE_DAYS;
                            // missingNextBillingTime = false;
                        }
                    }
                    if (orderId === _orderId) {
                        //tại sao lại bỏ trường hợp trùng với biến orderId ???
                        continue;
                    }

                    transactions.push({
                        time: value?.create_time,
                        planId,
                        nextBillingTime: next_billing_time,
                        orderId: _orderId,
                    });
                }
                result.push(...transactions);
            }

            if (result.length > 0) {
                result = result.map((el) => {
                    let expiryTime = Config.MILLISECONDS_PER_DAY * regularDate;
                    let start = new Date(el.time).getTime();
                    if (new Date(el.time).getUTCHours() < 10) {
                        expiryTime -= Config.MILLISECONDS_PER_DAY;
                    }
                    return {
                        time: start,
                        amount: el?.amount_with_breakdown?.gross_amount?.value ?? 0,
                        expiryDate: el.nextBillingTime
                            ? el.nextBillingTime
                            : new Date(
                                  (expiryTime == 0 ? start : start + expiryTime) -
                                      Math.abs(new Date().getTimezoneOffset()) * 60 * 1000
                              ).getTime(),
                        // type: "PRO", lấy trường status thay cho trường này
                        status: el.status,
                        planId: el.planId,
                        orderId: el.orderId,
                        // missingNextBillingTime: el.missingNextBillingTime,
                    };
                });
            }
            listTransaction = listTransaction.concat(result);
        } else {
            let data: any = await getTransactionsSubscriptionApi(orderId);
            if (data.transactions?.length > 0) {
                data.transactions.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                listTransaction = data.transactions.map((el) => {
                    let expiryTime = Config.MILLISECONDS_PER_DAY * regularDate;
                    let timeSeconds = new Date(el.time).getTime();
                    if (new Date(el.time).getUTCHours() < 10) {
                        expiryTime -= Config.MILLISECONDS_PER_DAY;
                    }
                    return {
                        time: timeSeconds,
                        amount: el.amount_with_breakdown.gross_amount.value,
                        expiryDate: new Date(
                            (expiryTime == 0 ? timeSeconds : timeSeconds + expiryTime) -
                                Math.abs(new Date().getTimezoneOffset()) * 60 * 1000
                        ).getTime(),
                        // type: "PRO",
                        status: el.status,
                        planId,
                        orderId,
                    };
                });
            }
        }
        listTransaction.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        // group theo orderId
        let tempOrderIds = [...orderIds];
        let mapTransaction: any = {};
        if (!tempOrderIds.includes(orderId)) tempOrderIds.push(orderId);
        tempOrderIds.forEach((id) => {
            if (!mapTransaction[id]) mapTransaction[id] = { trs: [], t: 0 };
            let _trs = listTransaction.filter((t) => t.orderId === id);
            mapTransaction[id].trs.push(..._trs);
            mapTransaction[id].t = _trs[_trs.length - 1].time;
        });
        let listBills = [];
        Object.values(mapTransaction)
            .sort((a: any, b: any) => b.t - a.t)
            .forEach((_: any) => {
                listBills.push(..._.trs);
            });

        return {
            orderInfo: {
                ...orderInfo,
                subscriptionInfo,
            },
            listTransaction: listBills,
        };
    } catch (error) {
        console.log(error);

        return { orderInfo: {}, listTransaction: [] };
    }
};

export const cancelSubscriptionAPI = async (orderId: string) => {
    try {
        let data = await callApi({
            url: "api/auth?type=cancel-subscription&orderId=" + orderId + (isProduction() ? "" : "&dev=true"),
            method: "get",
            params: null,
        });
        return data;
    } catch (error) {
        console.log("error", error);
    }
};
export const sendEmailSubscribeSuccessAPI = async (
    appInfo: IAppInfo,
    price: string,
    email: string,
    timeExpiration: Date,
    totalQuestion: string,
    name: string
) => {
    try {
        let website = window.location.origin;
        const learnPageSlug = await genStudyLink(appInfo);
        let learnPage = website + learnPageSlug;
        let billingPage = website + "/billing";
        let emailSupport = getContactLink("email");
        let params = {
            learnPage,
            billingPage,
            emailSupport,
            website,
            price,
            email,
            // email: "thanhtom.26122000@gmail.com",
            totalQuestion,
            timeExpiration,
            name,
            appName: appInfo.appName,
        };
        let data = await callApi({
            baseURl: "https://dev-dot-micro-enigma-235001.appspot.com/",
            url: "api/auth?type=send-email-success-subscription",
            method: "post",
            params: params,
        });
        return data;
    } catch (error) {
        console.log("error", error);
    }
};
export const cancelSubscriptionEmailAPI = async (appInfo: IAppInfo, timeExpiration: Date, name: string, email: string) => {
    try {
        let website = window.location.origin;
        let upgradeProPage = website + genLinkPro(appInfo);
        let emailSupport = getContactLink("email");
        let params = {
            emailSupport,
            website,
            upgradeProPage,
            email,
            timeExpiration,
            name,
            appName: appInfo.appName,
        };
        let data = await callApi({
            baseURl: "https://dev-dot-micro-enigma-235001.appspot.com/",
            url: "api/auth?type=send-email-cancel-subscription",
            method: "post",
            params: params,
        });
        return data;
    } catch (error) {
        console.log("error", error);
    }
};
