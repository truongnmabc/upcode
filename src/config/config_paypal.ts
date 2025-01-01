import { IAppInfo } from "@/models/app/appInfo";
import config_new_pro from "../data/config_new_pro.json";
import { isProduction } from "@/common/constants";

export const getConfigPro = (proType) => {
    if (config_new_pro) {
        let configPro = config_new_pro[proType];
        return configPro;
    }
};

export const PAYPAL_STYLE = {
    shape: "pill",
    tagline: false,
    height: 50,
    zIndex: 10,
    color: "white",
    layout: "vertical",
};

export const getConfigProV2 = (appInfo: IAppInfo) => {
    const result = {
        type: SUBSCRIPTION,
        prices: [],
    };
    try {
        let oneWeek = parseJSONdata(appInfo[ONEWEEKPRO]);
        let oneMonth = parseJSONdata(appInfo[ONEMONTHPRO]);
        let oneYear = parseJSONdata(appInfo[ONEYEARPRO]);
        let oneTime = parseJSONdata(appInfo[ONETIMEPRO]);
        const prices = [];

        let type = SUBSCRIPTION;
        if (oneWeek && oneMonth && oneYear) {
            const averagePrice1Week = getAveragePrice(oneWeek.price, 7);
            const averagePrice1Month = getAveragePrice(oneMonth.price, 30);
            const averagePrice1Year = getAveragePrice(oneYear.price, 365);
            const savePercent1Week = 0;
            const savePercent1Month = Math.floor(
                ((averagePrice1Week - averagePrice1Month) / averagePrice1Week) *
                    100
            );
            const savePercent1Year = Math.floor(
                ((averagePrice1Week - averagePrice1Year) / averagePrice1Week) *
                    100
            );
            prices.push({
                ...oneWeek,
                type: "1 week",
                trialDay: null,
                averagePrice: averagePrice1Week,
                savePrice: {
                    text: "Basic",
                    percent: savePercent1Week,
                },
                initPrice: null,
            });
            prices.push({
                ...oneMonth,
                type: "1 month",
                trialDay: 3,
                averagePrice: averagePrice1Month,
                savePrice: {
                    text: "Popular",
                    percent: savePercent1Month,
                },
                initPrice: getInitPrice(oneMonth.price, savePercent1Month),
            });
            prices.push({
                ...oneYear,
                type: "1 year",
                trialDay: 3,
                averagePrice: averagePrice1Year,
                savePrice: {
                    text: "Most economical",
                    percent: savePercent1Year,
                },
                initPrice: getInitPrice(oneYear.price, savePercent1Year),
            });
            if (!isProduction) {
                prices[0].planId = "P-5GE18939GM962423UMQVLK5Y";
                prices[1].planId = "P-2SH95524CM0826016MQVLLUI";
                prices[2].planId = "P-1VY99078S4786524AMQVLL4A";
            }
        } else if (oneTime) {
            prices.push({
                price: oneTime,
            });
            type = ONETIME;
        }
        result["type"] = type;
        result["prices"] = prices;
    } catch (error) {
        // console.log(error);
    }
    return result;
};

export const getConfigAppPro = (appInfo: IAppInfo, parrentName?: string) => {
    let appShortName = appInfo?.appShortName ?? "";
    if (parrentName) {
        appShortName = parrentName;
    }

    if (config_new_pro) {
        let appProInfo = config_new_pro.configApp[appShortName]; // lấy thông tin theo appShortName ???? đ hiểu khi mà cái appShortName nó như một cái tên mà mấy bố cũng dùng mà k check gì
        const { type, prices } = getConfigProV2(appInfo);

        if (type === ONETIME) {
            const price = prices[0]?.price ?? 9.99;
            // trường hợp oneTime (có 3 app là AP Psychology, APUSH, Series 7) thì gán giá trị default
            return {
                questionNumber: appInfo.totalQuestion,
                valuePro: `${price}`,
                pricePro: price,
                configName: "default_5",
                iapLockTest: 1,
                iapLockPart: 1,
            };
        }

        return appProInfo;
    }
};

const getInitPrice = (value: number, percent: number) => {
    return Math.ceil(value / ((100 - percent) / 100));
};

const getAveragePrice = (value: number, days: number) => {
    if (!value || !days) {
        return 1;
    }
    return parseFloat((value / days).toFixed(2));
};

const parseJSONdata = (jsonString: string) => {
    const isJSONString = (str: string) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    if (isJSONString(jsonString)) {
        return JSON.parse(jsonString);
    } else {
        return null;
    }
};

export const ONEWEEKPRO = "oneWeekPro";
export const ONEMONTHPRO = "oneMonthPro";
export const ONEYEARPRO = "oneYearPro";

export const ONETIMEPRO = "oneTimePro";
export const SUBSCRIPTION = "subcription";
export const ONETIME = "onetime";

export const PAYPAL_SUBSCRIPTION_CLIENT_ID = isProduction
    ? "AdB2eO_M5-okrwgabqjSMgbxuJGSXuw7tOTXNIPonty8TiHtCTZGjIErVHaBRYhsGQWNYZQjQlq4tJat"
    : "AVyimUfmrrnWOGW7GFSXlYm77H4O-JvvRBSBMqBDNj1_ATxF-hRsccOmXxx8lenoD1SND5UjC-MlY9Jm";

export const PAYPAL_SUBSCRIPTION_KEY = "subcription_key";

export const PAYPAL_CLIENT_ID = isProduction
    ? "AdB2eO_M5-okrwgabqjSMgbxuJGSXuw7tOTXNIPonty8TiHtCTZGjIErVHaBRYhsGQWNYZQjQlq4tJat"
    : "ASZuK4V1rzGFj333OzSTQM_TeNeD7VWkhTCUjoy2y6p7dgbIAoSYTSGaKwMGiGVoaHMxC-Mdb8D3wa3E";

export const PAYPAL_CURRENCY = "USD";
