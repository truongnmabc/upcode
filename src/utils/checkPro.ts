import Config from "@/config";
import { InAppSubscription, IPaymentInfo } from "@/models/payment/PaymentInfo";

const checkPro = (
    paymentInfo: IPaymentInfo,
    inAppPurchasedInfo: InAppSubscription[]
) => {
    let isPro = false;
    if (paymentInfo?.buyPro == Config.PURCHASED) {
        if (paymentInfo.expiredDate >= Date.now()) isPro = true; // mua pro và còn hạn
    }
    if (
        inAppPurchasedInfo.find((p) => {
            return (
                (p.purchased || p.trialPeriod) && p.expiredDate >= Date.now()
            );
        })
    )
        isPro = true; // trường hợp mua trên app
    return isPro;
};

export default checkPro;
