import Config from "@/config";

const checkPro = (paymentInfo, inAppPruchasedInfo) => {
    let isPro = false;
    if (paymentInfo?.buyPro == Config.PURCHARED) {
        if (paymentInfo.expiredDate >= Date.now()) isPro = true; // mua pro và còn hạn
    }
    if (
        inAppPruchasedInfo.find((p) => {
            return (p.purchased || p.trialPeriod) && p.expriredDate >= Date.now();
        })
    )
        isPro = true; // trường hợp mua trên app
    return isPro;
};

export default checkPro;
