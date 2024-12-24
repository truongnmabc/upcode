import Config from "../config";
import { genLinkPro } from "./home.service";
import { genStudyLink } from "@/utils/getStudyLink";
import { isProduction } from "@/common/constants";
import { callApi } from ".";
import { IAppInfo } from "@/models/app/appInfo";

/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_get
 * lấy thông tin của đơn hàng hiện tại
 */
export const checkPaypalStatusAPI = async (orderId: string) => {
    let data = await callApi({
        url:
            "api/auth?type=check-status-subcription&orderId=" +
            orderId +
            (!isProduction ? "&dev=true" : ""),
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
        url:
            "api/auth?type=get-plan-info&planId=" +
            planId +
            (!isProduction ? "&dev=true" : ""),
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
        url:
            "api/auth?type=get-transactions-subscription&orderId=" +
            orderId +
            (isProduction ? "" : "&dev=true"),
        method: "get",
        params: null,
    });
    return data;
};

/**
 ** Logic hàm này là dựa vào orderId để lấy paypal data theo orderId đó
 ** từ paypal data lấy được planId
 ** từ planId thì lấy được cycle của orderId đó (có trial hay không, hiệu lực của orderId đến bao giờ)
 ** tra cứu transactions data (những lần thanh toán theo orderId)
 */
export const getListTransactionAPI = async (
    orderId: string,
    orderIds: string[]
) => {
    try {
        const mapPlan_BillingCycle = {};
        const mapOrderId_status = {};
        const listTransaction: {
            time: number; // thời gian thực hiện transaction này
            amount: string; // giá trị
            startDate: number; // thời gian bắt đầu hiệu lực
            expiryDate: number; // thời gian hết hạn
            status: string; // trạng thái của transaction (Trial / Canceled / COMPLETED)
            planId: string;
            orderId: string;
        }[] = [];

        if (!orderIds.includes(orderId)) {
            orderIds.push(orderId);
        } // thường là điều kiện này không xảy ra, nhưng có thể có trường hợp orderIds = []

        for (let id of orderIds) {
            // lấy dữ liệu order, plan, transactions của orderId đang xét
            if (!mapOrderId_status[id])
                mapOrderId_status[id] = await checkPaypalStatusAPI(id);
            const order = mapOrderId_status[id];
            const planId = order.plan_id;
            if (!mapPlan_BillingCycle[planId]) {
                let planInfo: any = await getPlanInfoApi(planId); // lấy plan data của đơn hàng này
                mapPlan_BillingCycle[planId] = planInfo.billing_cycles;
            }
            const billingCycles = mapPlan_BillingCycle[planId];
            let transactionData = await getTransactionsSubscriptionApi(id); // có thể là một object rỗng
            const transactions = (transactionData?.transactions ?? []).sort(
                (a, b) =>
                    new Date(b.time).getTime() - new Date(a.time).getTime()
            );

            // xử lý dữ liệu
            let regularDate = 0; // dùng thật (dành cho orderId hiện tại)
            let trialDate = 0; // dùng thử (dành cho orderId hiện tại)
            let regularPrice = "0.00";
            billingCycles.forEach((el) => {
                if (el?.tenure_type == "REGULAR") {
                    regularDate +=
                        el?.frequency?.interval_count *
                        Config.DATE_VALUE_STRING[el?.frequency?.interval_unit];
                    regularPrice = el?.pricing_scheme?.fixed_price?.value;
                }
                if (el?.tenure_type === "TRIAL") {
                    trialDate +=
                        el?.frequency?.interval_count *
                        Config.DATE_VALUE_STRING[el?.frequency?.interval_unit];
                }
            });

            const startTime = new Date(order.create_time).getTime();
            const timeTrial =
                startTime + trialDate * Config.MILLISECONDS_PER_DAY;
            if (trialDate > 0) {
                // trường hợp trial
                listTransaction.push({
                    time: startTime, // thời gian thực hiện action này
                    amount: "0.00",
                    startDate: startTime, // thời gian bắt đầu hiệu lực
                    expiryDate: new Date(timeTrial).getTime(), // convert theo đúng timezone
                    status: "Trial",
                    planId,
                    orderId: id,
                });
            }

            if (!trialDate && regularDate) {
                // với gói 1 tuần (không có trial và thanh toán luôn, nhưng transactions lại không có dữ liệu (rỗng))
                // trường hợp nó đã gia hạn nhiều lần thì sao ??? (CHƯA CÓ HƯỚNG XỬ LÝ)
                if (transactions.length == 0) {
                    listTransaction.push({
                        time: startTime,
                        amount: regularPrice,
                        startDate: startTime,
                        expiryDate:
                            startTime +
                            regularDate * Config.MILLISECONDS_PER_DAY, // convert theo đúng timezone
                        status: "COMPLETED",
                        planId,
                        orderId: id,
                    });
                }
            }

            let _startTime = timeTrial;
            for (let t of transactions) {
                if (t.status !== "COMPLETED") continue; // check status của transaction cho chắc
                // xử lý từng transaction
                let price =
                    t?.amount_with_breakdown?.gross_amount?.value ?? "0.00";
                const time = new Date(t.time).getTime();
                if (_startTime < time) _startTime = time; // trường hợp thanh toán sau hạn;
                listTransaction.push({
                    time: time,
                    amount: price,
                    startDate: _startTime,
                    expiryDate:
                        _startTime + regularDate * Config.MILLISECONDS_PER_DAY, // convert theo đúng timezone
                    status: "COMPLETED",
                    planId,
                    orderId: id,
                });
                _startTime += regularDate * Config.MILLISECONDS_PER_DAY; // thời gian phải tính từ khi bắt đầu theo cycle, khôgn căn cứ vào mấy trường trong
            }

            if (order.status === "CANCELLED") {
                // trường hợp cancel, sẽ là transaction cuối cùng
                listTransaction.push({
                    time: new Date(order.update_time).getTime(),
                    amount: "0.00",
                    startDate: new Date(order.update_time).getTime(),
                    expiryDate: new Date(order.update_time).getTime(), // convert theo đúng timezone
                    status: "Cancelled",
                    planId,
                    orderId: id,
                });
            }
        }

        const orderInfo = mapOrderId_status[orderId];

        listTransaction.sort((a, b) => b.time - a.time);
        let mapTransaction: any = {};
        orderIds.forEach((id) => {
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
            orderInfo: { ...orderInfo },
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
            url:
                "api/auth?type=cancel-subscription&orderId=" +
                orderId +
                (isProduction ? "" : "&dev=true"),
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
export const cancelSubscriptionEmailAPI = async (
    appInfo: IAppInfo,
    timeExpiration: Date,
    name: string,
    email: string
) => {
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

function getContactLink(contactMethod) {
    let appName = "asvab";
    if (appName == "cdl" || appName == "cdl_v2") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/CDL-prep-101878645343877";
        } else if (contactMethod == "twitter") {
            return "https://twitter.com/CLprep";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCke4KGWOxPP8R2aPVQTUAlA";
        } else if (contactMethod == "linkedin") {
            return "https://www.youtube.com/channel/UCke4KGWOxPP8R2aPVQTUAlA";
        } else if (contactMethod == "email") {
            return "support@cdl-prep.com";
        }
    } else if (appName == "asvab") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/ASVAB-Test-Prep-by-ABC-Elearning-104795498352899";
        } else if (contactMethod == "twitter") {
            return "https://twitter.com/PrepAsvab";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UC9F-vTfB9PCbxvBT8zqMMJw";
        } else if (contactMethod == "email") {
            return "support@asvab-prep.com";
        }
    } else if (appName == "dmv") {
        if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UClGYoBo4B7IoffZXcwDdRUw";
        } else if (contactMethod == "twitter") {
            return "https://twitter.com/dmvprepabcteam";
        } else if (contactMethod == "email") {
            return "support@dmv-practicetests.com";
        }
    } else if (appName == "cna") {
        if (contactMethod == "email") {
            return "support@cna-prep.com";
        }
    } else if (appName == "drivingtheory") {
        if (contactMethod == "email") {
            return "support@drivingtheory-tests.com";
        }
    } else if (appName == "passemall") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/ABC-E-learning-110654290809849";
        } else if (contactMethod == "twitter") {
            return "https://twitter.com/abcelearningapp";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCkLKqup_8asTJGtQIgXCOZg";
        } else if (contactMethod == "email") {
            return "support@passemall.com";
        }
    } else if (appName == "realestate") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/Real-Estate-Exam-Prep-by-ABC-Elearning-107910338185108";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCFWA5MkzvzHlHYBFvT9BH9A/about";
        } else if (contactMethod == "email") {
            return "support@realestate-prep.com";
        }
    } else if (appName == "servsafe") {
        if (contactMethod == "facebook") {
            return "facebook.com/Servsafe-Exam-Prep-104667911889218";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UC7A8HrEXgdiR7otcxgAqZZQ/about";
        } else if (contactMethod == "email") {
            return "support@servsafe-prep.com";
        }
    } else if (appName == "aws") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/AWS-Exam-Prep-102525238774581";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCht1edKzc3jXi6RHu-kAXRA/about";
        } else if (contactMethod == "email") {
            return "support@aws-prep.com";
        }
    } else if (appName == "ptce") {
        if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCwk8caoOY4DiyteWcv17nbQ/about";
        } else if (contactMethod == "facebook") {
            return "https://www.facebook.com/PTCB-Exam-Prep-by-ABC-Elearning-102646622056698";
        } else if (contactMethod == "email") {
            return "support@ptceprep.com";
        }
    } else if (appName == "pmp") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/PMP-Exam-Prep-100596645638322";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCv3MA6wPjfvmctrQbrrWYrQ/about";
        } else if (contactMethod == "email") {
            return "support@pmp-testprep.com";
        }
    } else if (appName == "ged") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/people/TestPrep-Ged/100068351480720/";
        } else if (contactMethod == "youtube") {
            return "https://www.youtube.com/channel/UCsVHfTGvOjveDJSx6c4hdNQ/about";
        } else if (contactMethod == "email") {
            return "support@ged-testprep.com";
        }
    } else if (appName == "teas") {
        if (contactMethod == "facebook") {
            return "https://www.facebook.com/TEAS-Exam-Prep-113142767696481";
        } else if (contactMethod == "email") {
            return "support@teas-prep.com";
        }
    }
    return null;
}
