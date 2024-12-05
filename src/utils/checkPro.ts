import Config from "@/common/config";
import { InAppSubscription, IPaymentInfo } from "@/lib/models/user/PaymentInfo";

type PaymentInfo = {
  buyPro: string; // Giá trị của `buyPro` phải trùng với `Config.PURCHASED`
  expiredDate: number; // Thời gian hết hạn (UNIX timestamp)
};

type InAppPurchase = {
  purchased: boolean; // Đã mua hay chưa
  trialPeriod: boolean; // Đang dùng thử hay không
  expiredDate: number; // Thời gian hết hạn (UNIX timestamp)
};

type CheckProFn = (
  paymentInfo: IPaymentInfo | null,
  inAppPurchasedInfo: InAppSubscription[]
) => boolean;

const checkPro: CheckProFn = (paymentInfo, inAppPurchasedInfo) => {
  let isPro = false;

  //   // Kiểm tra trường hợp thanh toán qua `paymentInfo`
  //   if (paymentInfo?.buyPro === Config.PURCHASED) {
  //     if (paymentInfo.expiredDate >= Date.now()) {
  //       isPro = true; // Đã mua pro và còn hạn
  //     }
  //   }

  //   // Kiểm tra các giao dịch mua trong ứng dụng
  //   if (
  //     inAppPurchasedInfo.find(
  //       (p) => (p.purchased || p.trialPeriod) && p.expiredDate >= Date.now()
  //     )
  //   ) {
  //     isPro = true; // Đã mua trên app hoặc đang trong giai đoạn dùng thử
  //   }

  return isPro;
};

export default checkPro;
